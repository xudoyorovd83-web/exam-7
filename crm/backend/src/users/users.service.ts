import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.usersRepository.findOne({
      where: { phone: createUserDto.phone },
    });
    if (existing) {
      throw new ConflictException('User with this phone already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map(({ password, ...u }) => u);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByPhone(phone: string): Promise<User> {
    const foundedUser = await this.usersRepository.findOne({ where: { phone } });
    if(!foundedUser) throw new NotFoundException()
    return foundedUser
  }

  async findAdmins(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find({
      where: { role: UserRole.ADMIN },
      order: { createdAt: 'DESC' },
    });
    return users.map(({ password, ...u }) => u);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async seedSuperAdmin(): Promise<void> {
    const existing = await this.usersRepository.findOne({
      where: { role: UserRole.SUPERADMIN },
    });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('superadmin123', 10);
      const superadmin = this.usersRepository.create({
        fullName: 'Super Admin',
        phone: '+998900000000',
        password: hashedPassword,
        role: UserRole.SUPERADMIN,
      });
      await this.usersRepository.save(superadmin);
      console.log('SuperAdmin seeded: phone=+998900000000, password=superadmin123');
    }
  }
}
