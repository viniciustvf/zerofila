import { PartialType } from '@nestjs/swagger';
import { ClientDto } from './client.dto';

export class ClientUpdateDto extends PartialType(ClientDto) {}