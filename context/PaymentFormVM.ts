import { User } from "@prisma/client";
import { makeAutoObservable } from "mobx";


// this was made to be used in a complex feature but the feature was not cancelled
export default class PaymentFormVM {
  private users: Partial<User>[] = []; get Users() { return this.users; } set Users(value: Partial<User>[]) { this.users = value; }
  private houseId: string = ''; get HouseId() { return this.houseId; } set HouseId(value: string) { this.houseId = value; }
  private amount: number = 0; get Amount() { return this.amount; } get AmountString() { return this.amount.toFixed(2); } set Amount(value: number) { this.amount = value; }
  private amountError: string = ""; get AmountError() { return this.amountError; } set AmountError(value: string) { this.amountError = value; }
  private description: string = ''; get Description() { return this.description; } set Description(value: string) { this.description = value; }
  private descriptionError: string = ""; get DescriptionError() { return this.descriptionError; } set DescriptionError(value: string) { this.descriptionError = value; }
  private recipientId: string = ""; get RecipientId() { return this.recipientId; } set RecipientId(value: string) { this.recipientId = value; }
  private recipientIdError: string = ""; get RecipientIdError() { return this.recipientIdError; } set RecipientIdError(value: string) { this.recipientIdError = value; }
  private payersId: string[] = []; get PayersId() { return this.payersId; } set PayersId(value: string[]) { this.payersId = value; }
  private payersIdError: string = ""; get PayersIdError() { return this.payersIdError; } set PayersIdError(value: string) { this.payersIdError = value; }
  private paymentDate: string = ''; get PaymentDate() { return this.paymentDate; } set PaymentDate(value: string) { this.paymentDate = value; }
  private paymentDateError: string = ""; get PaymentDateError() { return this.paymentDateError; } set PaymentDateError(value: string) { this.paymentDateError = value; }
  private isSeparate: boolean = false; get IsSeparate() { return this.isSeparate; } set IsSeparate(value: boolean) { this.isSeparate = value; }
  private customAmounts: { [key: string]: number } = {}; get CustomAmounts() { return this.customAmounts; } set CustomAmounts(value: { [key: string]: number }) { this.customAmounts = value; }
  private customAmountsError: { [key: string]: string } = {}; get CustomAmountsError() { return this.customAmountsError; } set CustomAmountsError(value: { [key: string]: string }) { this.customAmountsError = value; }
  private isLoading: boolean = false; get IsLoading() { return this.isLoading; } set IsLoading(value: boolean) { this.isLoading = value; }

  constructor(
    users: Partial<User>[],
    houseId: string,
    defaultDate: Date,
  ) {
    makeAutoObservable(this);
    this.users = users;
    this.houseId = houseId;
    this.paymentDate = defaultDate.toISOString().split('T')[0];
  }

}
