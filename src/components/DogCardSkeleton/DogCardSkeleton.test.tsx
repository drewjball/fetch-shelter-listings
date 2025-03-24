import { describe, expect, it } from "vitest"
import { render, screen } from "../../test/test-utils"

import { DogCardSkeleton } from "./DogCardSkeleton"

describe("DogCardSkeleton", () => {
  it("renders skeleton elements", () => {
    render(<DogCardSkeleton />)

    const skeletons = screen.getAllByTestId("skeleton", { exact: false })

    expect(skeletons.length).toBeGreaterThan(0)
  })
})
