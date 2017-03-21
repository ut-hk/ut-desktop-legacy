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

export interface ActivityDto {
    startTime?: Date;

    endTime?: Date;

    participants?: Array<models.ActivityParticipantDto>;

    name?: string;

    descriptions?: Array<models.DescriptionDto>;

    location?: models.LocationDto;

    tags?: Array<models.TagDto>;

    ratings?: Array<models.RatingDto>;

    comments?: Array<models.CommentDto>;

    owner?: models.UserListDto;

    id?: string;

}
