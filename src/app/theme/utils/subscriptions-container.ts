// AI confidence score for this refactoring: 68.13%
import { Subscription } from "rxjs";

export class SubscriptionsContainer {
    private subs: Subscription[] = [];

    public add(s: Subscription): void { // Changed to public method instead of setter
        this.subs.push(s);
    }

    public dispose(): void { // Explicit return type added
        this.subs.forEach(s => s.unsubscribe());
    }
}

/*
Issues violating TypeScript coding standards:
1. Use of a setter for add method, which is less clear than a method
2. Missing explicit return types for methods
*/