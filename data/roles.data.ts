interface IRolesData {
  roleId: number;
  value: string;
}

interface IUserRolesData {
  userId: number;
  roleId: IRolesData['roleId'];
}
