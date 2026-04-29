import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { UsersService } from 'src/services/users/users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBody({ type: LoginUserDto })
  @Post('login')
  async login(@Body() payload: LoginUserDto) {
    return await this.usersService.login(payload);
  }
}
