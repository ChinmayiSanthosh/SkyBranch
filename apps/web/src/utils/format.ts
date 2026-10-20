export const formatSalary = (value: number) =>
    new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0,
    }).format(value);

export const fullName = (e: { name: string; surname: string }) => `${e.name} ${e.surname}`