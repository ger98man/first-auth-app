import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';
import { UserRole } from 'src/roles/user-roles.model';

interface UserCreationAttributes {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @ApiProperty()
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty()
  @Column({ type: DataType.DATE, allowNull: false })
  lastLogin: Date;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];
}
