import type { PageContext, StepResult } from "./types"
import type { FlowStep } from "../types"

export interface Stepper {
  execute(step: FlowStep, context: PageContext): Promise<StepResult>
}

export class MockStepper implements Stepper {
  async execute(step: FlowStep, _context: PageContext): Promise<StepResult> {
    const delay = Math.random() * 500 + 200
    await new Promise((resolve) => setTimeout(resolve, delay))

    switch (step.type) {
      case "navigate":
        return { success: true, duration: delay, data: { url: step.value || step.selector } }
      case "click":
        return { success: true, duration: delay, data: { clicked: step.selector } }
      case "fill":
        return { success: true, duration: delay, data: { filled: step.selector, value: step.value } }
      case "extract":
        return {
          success: true,
          duration: delay,
          data: {
            items: [
              { title: "Sample Item 1", price: 29.99 },
              { title: "Sample Item 2", price: 49.99 },
            ],
          },
        }
      case "wait":
        return { success: true, duration: 1000 }
      case "scroll":
        return { success: true, duration: delay }
      case "screenshot":
        return { success: true, duration: delay, screenshot: "data:image/png;base64,..." }
      default:
        return { success: true, duration: delay }
    }
  }
}
