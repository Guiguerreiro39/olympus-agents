export class UnexpectedError<E> extends Error {
  reason: E;

  constructor(message: string, reason: E) {
    super(message);
    this.reason = reason;
  }
}
