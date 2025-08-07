import {describe, expect, it} from "vitest";
import { render, screen } from '@testing-library/react'
import Page from '../page'
 
describe('Page', () => {
  it('renders a welcome message', () => {
    render(<Page />)
 
    const welcomeMessage = screen.getByText(/Get started by editing/i)
 
    expect(welcomeMessage).toBeDefined()
  })
})