import { action, observable } from "mobx";
import { saveMessage } from "../db/dbUtils";
import { Message, Sender } from "../domain/message";

export const historyStore: HistoryStore = observable<HistoryStore>(
  {
    id: 0,
    history: [],
    get historyFormatted(): string {
      return this.history
        .map((d) => {
          if (d.sender === Sender.Human) {
            return `Human: ${d.text}`;
          } else {
            return `AI: ${d.text}`;
          }
        })
        .join(`\n`);
    },
    addMessage(message: Message, toDB?: boolean) {
      if (toDB) {
        this.id += 1;
        saveMessage(this.id, message);
      }
      this.history.push(message);
    },
    setId(newId: number) {
      this.id = newId;
    },
    message: "",
    setMessage(newMessage: string) {
      this.message = newMessage;
    },
    get canSend() {
      return this.message.trim().length > 0;
    },
  },
  {
    addMessage: action.bound,
    setId: action.bound,
    setMessage: action.bound,
  }
);

export interface HistoryStore {
  id: number;
  history: Message[];
  historyFormatted: string;
  addMessage: (dialog: Message, toDB?: boolean) => void;
  setId: (newId: number) => void;
  canSend: boolean;
  message: string;
  setMessage: (newMessage: string) => void;
}
