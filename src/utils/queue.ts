export class Queue<T> {
    private storage: Array<T> = []
    private capacity: number

    constructor(capacity: number = 10) {
        this.capacity = capacity
    }

    queue(data: T): void {
        if (this.size == this.capacity) {
            this.storage.pop()
        }
        this.storage.unshift(data)
    }

    dequeue(): T | undefined {
        return this.storage.pop()
    }

    get size(): Readonly<number> {
        return this.storage.length
    }

    get(index: number): T {
        return this.storage[index]
    }
}
