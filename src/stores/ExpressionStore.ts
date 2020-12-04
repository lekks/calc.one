import {EventEmitter} from 'fbemitter';

import {AppDispatcher, Event} from "../dispatcher/AppDispatcher";
import Actions from "../dispatcher/Actions";
import {Calculator, StackItem} from "../calculator/Calculator";

export enum ExpressionEvents {
    INPUT_CHANGE_EVENT = "INPUT_CHANGE_EVENT",
    STACK_CHANGE_EVENT = "STACK_CHANGE_EVENT",
}

class ExpressionStore {
    private calc: Calculator;

    private emitter: EventEmitter;
    private dispatcher: typeof AppDispatcher;
    private dispatchToken: string;

    constructor() {
        this.dispatcher = AppDispatcher;
        this.dispatchToken = this.dispatcher.register(payload => {
            this.reactActions(payload);
        });

        this.emitter = new EventEmitter();
        this.calc = new Calculator(
            () => {
                this.emitter.emit(ExpressionEvents.INPUT_CHANGE_EVENT)
            },
            () => {
                this.emitter.emit(ExpressionEvents.STACK_CHANGE_EVENT)
            }
        )
    }

    public getInput(): string {
        return this.calc.getInputText();
    }


    public getStack(): StackItem[] {
        return this.calc.getStack();
    }

    public addChangeListener(event: ExpressionEvents, callback: () => void) {
        return this.emitter.addListener(event, callback);
    }

    private reactActions(action: Event) {
        switch (action.action) {
            case Actions.ADD_NUMBER:
                this.calc.addNumber(action.payload);
                break;
            case Actions.OPERATION:
                this.calc.addOperation(action.payload);
                break;
            case Actions.DEL:
                this.calc.del();
                break;
            case Actions.CLEAR:
                this.calc.clear();
                break;
            case Actions.BS:
                this.calc.backSpace();
                break;
            case Actions.ENTER:
                this.calc.push();
                break;
            case Actions.SWAP:
                this.calc.swap();
                break;
        }
    }
}

const expressionStore = new ExpressionStore();
export {expressionStore};
