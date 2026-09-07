import type { Group } from "@/types/group";

export const branches = [
    {
        id: 1,
        name: "Lilongwe Main Branch",
    },
    {
        id: 2,
        name: "Blantyre Branch",
    },
    {
        id: 3,
        name: "Mzuzu Branch",
    },
];

export const mockGroups: Group[] = [
    {
        id: 1,
        title: "Northside Traders",
        chair: "Sarah Jenkins",
        cellphone: "0999 123 456",
        viceChair: "Mary Banda",
        viceChairCell: "0888 234 567",
        description: "Small business traders group.",
        status: "active",
        branchId: 1,
        branchName: "Lilongwe Main Branch",
        memberCount: 18,
    },
    {
        id: 2,
        title: "Downtown Merchants",
        chair: "Marcus Rodriguez",
        cellphone: "0999 345 678",
        viceChair: "John Phiri",
        viceChairCell: "0888 456 789",
        description:
            "Merchants operating in the central business area.",
        status: "active",
        branchId: 2,
        branchName: "Blantyre Branch",
        memberCount: 24,
    },
    {
        id: 3,
        title: "Mzuzu Farmers",
        chair: "David Chen",
        cellphone: "0999 567 890",
        viceChair: "Grace Banda",
        viceChairCell: "0888 678 901",
        description:
            "Agricultural and farming cooperative group.",
        status: "inactive",
        branchId: 3,
        branchName: "Mzuzu Branch",
        memberCount: 12,
    },
];

export function getMockGroup(id: number) {
    return mockGroups.find((group) => group.id === id);
}