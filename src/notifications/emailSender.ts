export interface SentEmail {
  to: string;
  subject: string;
  body: string;
}

export interface EmailSender {
  send(to: string, subject: string, body: string): void;
}

/** Records messages instead of sending them. Used by the app and the tests. */
export class FakeEmailSender implements EmailSender {
  readonly sent: SentEmail[] = [];

  send(to: string, subject: string, body: string): void {
    this.sent.push({ to, subject, body });
  }
}
