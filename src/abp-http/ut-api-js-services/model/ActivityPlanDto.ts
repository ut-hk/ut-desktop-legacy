/**
 * UniTime.WebApi
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from './models';

export interface ActivityPlanDto {
    name?: string;

    descriptions?: Array<models.DescriptionDto>;

    tags?: Array<models.TagDto>;

    timeSlots?: Array<models.ActivityPlanTimeSlotDto>;

    comments?: Array<models.CommentDto>;

    ratings?: Array<models.RatingDto>;

    owner?: models.UserListDto;

    myRatingStatus?: ActivityPlanDto.MyRatingStatusEnum;

    likes?: number;

    id?: string;

}
export namespace ActivityPlanDto {
    export enum MyRatingStatusEnum {
        NUMBER_0 = <any> 0,
        NUMBER_1 = <any> 1
    }
}
