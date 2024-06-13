import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDTO implements Readonly<EmailDTO> {
    @ApiProperty({
        example: 'john@mail.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

