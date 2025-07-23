import { PartialType } from '@nestjs/swagger';
import { CreateRewardDto } from './create-users.dto';


export class UpdateRewardDto extends PartialType(CreateRewardDto) {
  
}
