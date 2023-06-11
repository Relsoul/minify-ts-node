// import {
//   registerDecorator,
//   ValidationOptions,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
//   ValidationArguments,
// } from 'class-validator';
// import { AdminService } from '../admin/admin.service';
// import * as dayjs from 'dayjs';
// import * as Between from 'dayjs/plugin/isBetween';
// dayjs.extend(Between);

// @ValidatorConstraint({ async: true })
// export class IsVoteAlreadyExistConstraint
//   implements ValidatorConstraintInterface
// {
//   async validate(argname, args: any) {
//     const value = args.value;
//     const reverse = args.constraints[0].reverse;
//     const queryObj = {
//       id: '',
//     };
//     queryObj.id = value;
//     const data = await args.object.adminService.listVoteDetail(queryObj);
//     if (data) {
//       // 如果反转存在，如果查询project对应存在出来为true，反转后应该为false
//       return !reverse;
//     }
//     return reverse;
//   }
// }

// type arg = {
//   reverse?: boolean;
// };
// export function IsVoteAlreadyExist(
//   arg: arg,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [arg],
//       validator: IsVoteAlreadyExistConstraint,
//     });
//   };
// }

// @ValidatorConstraint({ async: true })
// export class IsBetweenVoteHoursConstraint
//   implements ValidatorConstraintInterface
// {
//   async validate(argname, args: any) {
//     const value = args.value;
//     const reverse = args.constraints[0].reverse;
//     const queryObj = {
//       id: '',
//     };
//     queryObj.id = value;
//     const data = await (
//       args.object.adminService as AdminService
//     ).listVoteDetail(queryObj);

//     const now = dayjs();
//     const isBetween = now.isBetween(dayjs(data.startTime), dayjs(data.endTime));
//     if (isBetween) {
//       // 如果反转存在，如果查询project对应存在出来为true，反转后应该为false
//       return !reverse;
//     }
//     return reverse;
//   }
// }

// type barg = {
//   reverse?: boolean;
// };
// export function IsBetweenVoteHours(
//   arg: barg,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [arg],
//       validator: IsBetweenVoteHoursConstraint,
//     });
//   };
// }

// @ValidatorConstraint({ async: true })
// export class HasUserVoteByIdCardConstraint
//   implements ValidatorConstraintInterface
// {
//   async validate(argname, args: any) {
//     const value = args.value;
//     const reverse = args.constraints[0].reverse;

//     const data = await (
//       args.object.adminService as AdminService
//     ).getVoteUserByVoteIdAndUserCard({
//       voteId: args.object.id,
//       userCard: value,
//     });
//     if (!data) {
//       // 如果反转存在，如果查询project对应存在出来为true，反转后应该为false
//       return !reverse;
//     }
//     return reverse;
//   }
// }

// type carg = {
//   reverse?: boolean;
// };
// export function HasUserVoteByIdCard(
//   arg: carg,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [arg],
//       validator: HasUserVoteByIdCardConstraint,
//     });
//   };
// }

// @ValidatorConstraint({ async: true })
// export class HasCandidateConstraint implements ValidatorConstraintInterface {
//   async validate(argname: darg, args: any) {
//     const value = args.value;
//     const reverse = args.constraints[0].reverse;

//     const candidate = args.object[args.constraints[0].candidateKey];

//     const data = await (
//       args.object.adminService as AdminService
//     ).listVoteDetail({
//       id: args.object[args.constraints[0].voteIdKey],
//     });

//     if (data) {
//       const find = data.refCandidate.find((n) => {
//         return String(n._id) === candidate;
//       });
//       if (find) {
//         // 如果反转存在，如果查询project对应存在出来为true，反转后应该为false
//         return !reverse;
//       }
//     }
//     return reverse;
//   }
// }

// type darg = {
//   candidateKey?: string;
//   voteIdKey?: string;
//   reverse?: boolean;
// };
// export function HasCandidate(
//   { candidateKey = 'candidate', voteIdKey = 'id' }: darg,
//   validationOptions?: ValidationOptions,
// ) {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       constraints: [{ candidateKey, voteIdKey }],
//       validator: HasCandidateConstraint,
//     });
//   };
// }
