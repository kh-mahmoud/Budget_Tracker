import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import { AddToGroup, CreateGroup, DeleteGroup, RemoveFromGroup, UpdateGroup, UpdateGroupMember } from '@/lib/actions/group.actions'




export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // CREATE user
  if (eventType === "user.created") {

    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!,
      firstName: first_name!,
      lastName: last_name!,
      photo: image_url,
      currency: undefined
    };


    const newUser = await createUser(user);

    // Set public metadata
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser.id,
        },
      });
    }


    return NextResponse.json({ message: "OK", user: newUser });
  }


  // UPDATE user
  if (eventType === "user.updated") {
    const { image_url, username, id } = evt.data;

    const user = {
      username: username!,
      photo: image_url,
    };

    const updatedUser = await updateUser(user, id);

    return NextResponse.json({ message: "OK", user: updatedUser });
  }



  // DELETE user
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }


  // Organization create
  if (eventType === "organization.created") {

    try {
      const { id, image_url, name, slug, created_by } = evt.data

      const group = {
        OrgId: id,
        name,
        image: image_url,
        slug,
      }

      const newGroup = await CreateGroup(group, created_by)

      return NextResponse.json({ message: "OK", user: newGroup });
    } catch (error) {
      console.log(error)
    }


  }

  // Organization update
  if (eventType === "organization.updated") {

    try {

      const { image_url, name, slug, id } = evt.data

      const group = {
        name,
        image: image_url,
        slug,
      }

      const updateGroup = await UpdateGroup(group, id)

      return NextResponse.json({ message: "OK", user: updateGroup });


    } catch (error) {
      console.log(error)
    }

  }

  // Organization delete
  if (eventType === "organization.deleted") {

    const { id } = evt.data
    if (!id) throw new Error("organization not found")

    const deleteGroup = await DeleteGroup(id)

    return NextResponse.json({ message: "OK", user: deleteGroup });

  }

  // Organization add member
  if (eventType === "organizationMembership.created") {

    const { organization, public_user_data, role } = evt.data

    const addMember = await AddToGroup(organization.id, public_user_data.user_id, role)

    return NextResponse.json({ message: "OK", user: addMember });



  }

  // Organization update member

  if (eventType === "organizationMembership.updated") {

    const { role, public_user_data,organization } = evt.data

    const updateMember = await UpdateGroupMember(role, public_user_data.user_id,organization.id)


    return NextResponse.json({ message: "OK", user: updateMember });

  }


  // Organization delete member
  if (eventType === "organizationMembership.deleted") {

    const { organization, public_user_data, role } = evt.data

    const deleteMember = await RemoveFromGroup(organization.id, public_user_data.user_id, role)


    return NextResponse.json({ message: "OK", user: deleteMember });

  }

  return new Response("", { status: 200 });
}




