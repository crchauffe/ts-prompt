import { EOL } from "node:os";
import * as Readline from "node:readline/promises";
import * as Stream from "stream"


/**
 * Prompts the user for some input
 * @param message the message to display before pausing for user input
 * @returns the data entered by the user
 */
export async function prompt(message: string) {

    return new Promise<string>((resolve, reject) => {
        const readLine = Readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        readLine.once("line", (input) => {
            
            readLine.close()
            resolve(input)
        })

        readLine.setPrompt(message)
        readLine.prompt()
    })
}

/**
 * This would normally be useless, but for secret entry it's not!
 */
class MutedStream extends Stream.Writable {
    _write(buffer: Buffer, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        // intentionally blank.  don't do anything when asked to write something
    }
}

/**
 * Prompts the user for a secret and doesn't display their entry in the terminal
 * @param message the message to display before pausing for user input
 * @returns the secret entered by the user
 */
export async function promptSecret(message: string) {
    return new Promise<string>((resolve) => {
        // initialize the muted stream
        const mutedStream = new MutedStream()

        // set up readline in the usual way
        const readLine = Readline.createInterface({
            input: process.stdin,
            output: mutedStream,
            terminal: true
        })

        // add a listener for when the user enters a line
        readLine.once("line", (input) => {
            // the user hit enter

            // clean up readline
            readLine.close()

            // since stdout is muted, the EOL wasn't printed
            // go ahead and add an EOL to show the line was read
            process.stdout.write(EOL)

            // resolve the promise with the input from the user
            resolve(input)
        })

        // write the message to stdout
        process.stdout.write(message);
    })
}
