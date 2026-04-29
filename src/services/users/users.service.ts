import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Model } from 'mongoose';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { User, UserDocument } from 'src/schemas/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async findByUsername(username: string) {
    return await this.userModel.findOne({ username }).exec();
  }

  async login(payload: LoginUserDto) {
    const user = await this.findByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    return {
      accessToken,
    };
  }
}
