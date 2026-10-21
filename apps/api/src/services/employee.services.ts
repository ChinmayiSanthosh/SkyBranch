import { prisma } from "../db";
import { HttpError } from "../utils/errors";
import { EmployeeInput, UpdateEmployeeInput } from "../validators/employee.validator";


const employeeSelect = {
    id:true,
    name:true,
    surname:true,
    email:true,
    birthDate:true,
    employeeNumber: true,
    salary: true,
    role: true,
    managerId: true,
    manager: { select: { id: true, name: true, surname: true } },
    createdAt: true,
    updatedAt: true,
}as const;

interface EmployeeRow{
    id:number;
    name:string;
    surname:string;
    email:string;
    birthDate:Date;
    employeeNumber: string;
    salary:{toNumber():number};
    role: string;
    managerId: number | null;
    manager: {id: number;name:string; surname:string}| null;
    createdAt: Date;
    updatedAt: Date;
}

//so this basically converts the database row into what the api sends out

function toDto(e:EmployeeRow) {
    const { salary, birthDate, ...rest} = e;
    return {
        ...rest,
        birthDate:birthDate.toISOString().slice(0,10),
        salary: salary.toNumber(),
    };
}

export type EmployeeDto = ReturnType<typeof toDto>;
export type TreeNode = EmployeeDto & { children: TreeNode[] };

//who reports to who and its rules:
//manager should exist, no self manager, no chains

async function assertValidManager(employeeId:number | null, managerId: number | null |undefined){
    if (managerId === null || managerId === undefined) return;

    if (employeeId !== null && managerId === employeeId) {
        throw new HttpError(400, "An employee cannot be their own manager");
    }

    const all = await prisma.employee.findMany({select: {id:true, managerId:true}});
    const parentOf = new Map<number,number | null>(all.map( (e) => [e.id,e.managerId] ));

    if (!parentOf.has(managerId)) {
        throw new HttpError(400, "The selected manager does not exist");
    }

    if (employeeId !== null) {
        //to avoid circular dependencies
        const seen = new Set<number>();
        let current: number | null | undefined = managerId;
        while (current !== null && current !==undefined && !seen.has(current)){
            if (current === employeeId) {
                throw new HttpError(400, "This change would create a circular reporting chain");
            }
            seen.add(current)
            current = parentOf.get(current);
        }
    }

}

export async function listEmployees(search?: string) {
  const term = search?.trim();
  const rows = await prisma.employee.findMany({
    where: term
      ? {
          OR: [
            {name: {contains: term, mode: "insensitive" }},
            {surname:{ contains: term,mode: "insensitive"}},
            {email: {contains: term, mode: "insensitive" }},
            {employeeNumber:{ contains: term, mode:"insensitive" }},
            {role: {contains: term,mode: "insensitive" }},
          ],
        }
      : undefined,
    select: employeeSelect,
    orderBy: [{surname: "asc"}, { name:"asc" }],
  });
  return rows.map(toDto);
}

export async function getEmployee(id: number) {
    const row = await prisma.employee.findUnique({where:{id}, select:employeeSelect});
    if (!row) throw new HttpError(404, "Employee not found");
    return toDto(row);
}

// highest plus 1 nd old ones can be reused 
async function nextEmployeeNumber(): Promise<string> {
  const rows = await prisma.employee.findMany({ select: { employeeNumber: true } });
  const highest = rows.reduce((max, row) => {
    const match = /^E(\d+)$/.exec(row.employeeNumber);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `E${String(highest + 1).padStart(3, "0")}`;
}

export async function createEmployee(data: EmployeeInput) {
  await assertValidManager(null, data.managerId);

  const emailTaken = await prisma.employee.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (emailTaken) throw new HttpError(409, "An employee with this email already exists");

  // If two people are added at the same moment, the unique constraint rejects the second
  // number, and we simply try again with a fresh one
  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const row = await prisma.employee.create({
        data: { ...data, employeeNumber: await nextEmployeeNumber() },
        select: employeeSelect,
      });
      return toDto(row);
    } catch (err) {
      if ((err as { code?: string }).code !== "P2002") throw err;
      lastError = err;
    }
  }
  throw lastError;
}

export async function updateEmployee(id:number, data:UpdateEmployeeInput){

    const existing = await prisma.employee.findUnique({where:{id},select:{ id:true}});
    if (!existing) throw new HttpError(404, "Employee not found");
    if (data.managerId !== undefined) {
        await assertValidManager(id, data.managerId);
    }
    const row = await prisma.employee.update({ where:{ id},data, select: employeeSelect});
    return toDto(row);
}


export async function deleteEmployee(id:number) {
    const existing = await prisma.employee.findUnique({
        where: {id},
        select: {id:true, managerId:true},
    });
    if(!existing) throw new HttpError(404, "Employee not found");

    // direct reports move up to the delted employees manager and THEN the employee is removed so that it dont break just like that uk
    await prisma.$transaction([
        prisma.employee.updateMany({
            where:{managerId:id},
            data:{managerId: existing.managerId},
        }),
        prisma.employee.delete({where:{id}}),
    ]);
}


export async function getHierarchy(): Promise<TreeNode[]> {

    const rows = await prisma.employee.findMany({
        select: employeeSelect,
        orderBy: [{ surname: "asc" },{ name:"asc" }],
    });
     const nodes = new Map<number, TreeNode>(
        rows.map((r) => [r.id,{ ...toDto(r),children:[]}])
    );
    const roots: TreeNode[] =[];
    for (const node of nodes.values()) {
        const parent = node.managerId !== null ? nodes.get(node.managerId) : undefined;
        if (parent) parent.children.push(node);
        else roots.push(node);
    }
    return roots;
}