import { render, screen } from "../../test/test-utils"
import { describe, it, expect } from "vitest"
import { DogCardSkeleton } from "./DogCardSkeleton"

describe("DogCardSkeleton", () => {
  it("renders skeleton elements", () => {
    render(<DogCardSkeleton />)

    // Find skeleton elements by their class name
    const skeletons = screen.getAllByTestId("skeleton", { exact: false })

    // Should have one skeleton container with multiple skeleton parts
    expect(skeletons.length).toBeGreaterThan(0)
  })
})
