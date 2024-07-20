'use server'

import { prisma } from "../prismaClient";


export const ClauseBuilder = async (projectId: string, userId: string, orgId: string | undefined) => {
    if (orgId) {
        const project = await prisma.project.findUnique({
            where: { id: projectId, OrgId: orgId },
            include: { group: { select: { memberId: true } } }
        });
        if (!project) throw new Error("project not found");
        return {
            project,
            whereClause: { userId: { in: project.group?.memberId } }
        };
    } else {
        return {
            whereClause: { userId }
        };
    }
}






