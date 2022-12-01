import { Model, Table, Column, AllowNull, AutoIncrement, BelongsTo, Unique, Default, PrimaryKey, ForeignKey, Comment, DataType, CreatedAt, UpdatedAt }
  from 'sequelize-typescript';

@Table({ tableName: 'Company' })
export class Company extends Model<Company> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  logo: string;

  @Column
  banner: string;

  @Column
  planId?: number;

  @Column
  discount?: number;

  @Column
  discountPercentage?: number;

  @Column
  currencySymbol?: string;

  @Column
  lastContract?: string;

  @Column
  currency?: string;

  @CreatedAt
  @Column(DataType.DATE(6))
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE(6))
  updatedAt: Date;
}
