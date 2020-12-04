import {AppDispatcher, Event} from "../dispatcher/AppDispatcher";
import Actions from "../dispatcher/Actions";
import {Calculator, StackItem} from "../calculator/Calculator";
import {Subject} from "rxjs"

class ExpressionStore {
    public readonly editorText = new Subject<string>();
    public readonly expressionStack = new Subject<StackItem[]>();
    private calc: Calculator = new Calculator();
    private dispatcher: typeof AppDispatcher;
    private dispatchToken: string;

    constructor() {
        this.dispatcher = AppDispatcher;
        this.dispatchToken = this.dispatcher.register(payload => {
            this.reactActions(payload);
        });

        this.calc.editorText.subscribe(this.editorText)
        this.calc.expressionStack.subscribe(this.expressionStack)
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
