import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './counterReducer'

describe('unicafe reducer', () => {
    const initialState = {
        good: 0,
        ok: 0,
        bad: 0,
    }

    test('should return a proper initial state when called with undefined state', () => {
        const action = {
            type: 'DO_NOTHING',
        }

        const newState = counterReducer(undefined, action)
        expect(newState).toEqual(initialState)
    })

    test('good is incremented', () => {
        const action = {
            type: 'GOOD',
        }
        const state = initialState

        deepFreeze(state)

        const newState = counterReducer(state, action)
        expect(newState).toEqual({
            good: 1,
            ok: 0,
            bad: 0,
        })
    })

    test('ok and bad are incremented', () => {
        const initialState = {
            good: 0,
            ok: 0,
            bad: 0,
        }

        const actionIncreaseOk = { type: 'OK' }
        const actionIncreaseBad = { type: 'BAD' }

        deepFreeze(initialState)

        let newState = counterReducer(initialState, actionIncreaseOk)
        newState = counterReducer(newState, actionIncreaseBad)
        newState = counterReducer(newState, actionIncreaseBad)

        expect(newState).toEqual({
            good: 0,
            ok: 1,
            bad: 2,
        })
    })

    test('State is reset', () => {
        const initialState = {
            good: 0,
            ok: 0,
            bad: 0,
        }

        deepFreeze(initialState)

        const resetAction = { type: 'RESET' }
        const newState = counterReducer(initialState, resetAction)
        expect(newState).toEqual(initialState)
    })

    test('Invalid state type retuns same state', () => {
        const initialState = {
            good: 0,
            ok: 5,
            bad: 2,
        }

        deepFreeze(initialState)

        const resetAction = { type: 'NOTEXISTS' }
        const newState = counterReducer(initialState, resetAction)
        expect(newState).toEqual(initialState)
    })
})
