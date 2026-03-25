const { test, expect, beforeEach, describe } = require('@playwright/test')
import { loginWith, createBlog, likeBlogWithTitle } from './helper'

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        // reset the application (remove users and blogs)
        await request.post('/api/testing/reset')

        // create two new users
        const newUser1 = {
            username: 'giannis95',
            password: '12345678',
            name: 'ioannis marargkakis',
        }

        const newUser2 = {
            username: 'giorgos95',
            password: '12345678',
            name: 'giorgos marargkakis',
        }
        await request.post('/api/users', { data: newUser1 })
        await request.post('/api/users', { data: newUser2 })

        // go to the frontend page configured in baseURL
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        // assure login title is visible
        await expect(
            page.getByRole('heading', { name: 'Log in to application' }),
        ).toBeVisible()
        // ensure login button is visible
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            const correctCred = { username: 'giannis95', password: '12345678' }
            await loginWith(page, correctCred.username, correctCred.password)
            // ensure logout button is visible (succesfull login)
            await expect(
                page.getByRole('button', { name: 'logout' }),
            ).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            const invCred = { username: 'giannis95', password: '1357912' }
            await loginWith(page, invCred.username, invCred.password)
            const loginButton = page.getByRole('button', {
                name: 'login',
            })
            // if unsuccesfull login, login button still visible
            await expect(loginButton).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            // log in with this user before every test
            await loginWith(page, 'giannis95', '12345678')
            // open the create blog section
            await page.getByRole('button', { name: 'create new blog' }).click()
            // create a new blog
            await createBlog(page, {
                title: 'a new title',
                author: 'a new author',
                url: 'https://fullstackopen.com/en/part5',
            })
        })

        test('a new blog can be created', async ({ page }) => {
            // get the blog container and filter to have the specific title
            const blog = page
                .locator('.blog')
                .filter({ hasText: 'a new title' })
            await expect(blog).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            // get the blog container and filter to have the specific title
            const blog = page
                .locator('.blog')
                .filter({ hasText: 'a new title' })
            // view extra information
            await blog.getByRole('button', { name: 'view' }).click()
            // like the blog
            await blog.getByRole('button', { name: 'like' }).click()
            await expect(blog.locator('.likes-value')).toHaveText('1')
        })

        test('a user who created the blog can delete it also', async ({
            page,
        }) => {
            // get the blog container and filter to have the specific title
            const blog = page
                .locator('.blog')
                .filter({ hasText: 'a new title' })
            // view extra information
            await blog.getByRole('button', { name: 'view' }).click()
            // find the remove button
            const removeButton = blog.getByRole('button', {
                name: 'remove',
            })
            // ensure remove button visible
            await expect(removeButton).toBeVisible()
            // accept the remove operation later
            page.on('dialog', (dialog) => dialog.accept())
            // click the remove button
            await removeButton.click()
            // ensure blog is removed
            const removedBlog = page
                .locator('.blog')
                .filter({ hasText: 'a new title' })
            await expect(removedBlog).not.toBeVisible()
        })
    })

    describe('Logged in user', () => {
        // login with two users to test this
        beforeEach(async ({ page }) => {
            // first login with giannis and create a blog and logout
            await loginWith(page, 'giannis95', '12345678')
            await page.getByRole('button', { name: 'create new blog' }).click()
            await createBlog(page, {
                title: 'a new title 1',
                author: 'giannis author',
                url: 'https://fullstackopen.com/en/part4',
            })
            await page.getByRole('button', { name: 'logout' }).click()
            // then log in as giorgos create another blog and logout
            await loginWith(page, 'giorgos95', '12345678')
            await page.getByRole('button', { name: 'create new blog' }).click()
            await createBlog(page, {
                title: 'a new title 2',
                author: 'giorgos author',
                url: 'https://fullstackopen.com/en/part5',
            })
            await page.getByRole('button', { name: 'logout' }).click()
        })

        test('can see his own posts remove button', async ({ page }) => {
            // now log in with giannis account
            await loginWith(page, 'giannis95', '12345678')
            // get the blog giannis created
            const giannisBlog = page
                .locator('.blog')
                .filter({ hasText: 'a new title 1' })
            await giannisBlog.getByRole('button', { name: 'view' }).click()
            // ensure giannis can see the remove button in the blog he created
            const giannisRemoveButton = giannisBlog.getByRole('button', {
                name: 'remove',
            })
            await expect(giannisRemoveButton).toBeVisible()

            // now get the blog giorgos created
            const giorgosBlog = page
                .locator('.blog')
                .filter({ hasText: 'a new title 2' })
            await giorgosBlog.getByRole('button', { name: 'view' }).click()
            // ensure giannis cannot see the remove button of the blog
            // giorgos created
            const giorgosRemoveButton = giorgosBlog.getByRole('button', {
                name: 'remove',
            })
            await expect(giorgosRemoveButton).not.toBeVisible()
        })
    })

    test('Likes are arranged descending', async ({ page }) => {
        test.setTimeout(30_000)
        await loginWith(page, 'giannis95', '12345678')
        // open the create blog section
        await page.getByRole('button', { name: 'create new blog' }).click()
        // create three blogs
        await createBlog(page, {
            title: 'a new title 1',
            author: 'giannis',
            url: 'https://fullstackopen.com/en/part5',
        })
        await createBlog(page, {
            title: 'a new title 2',
            author: 'giannis',
            url: 'https://fullstackopen.com/en/part5',
        })
        await createBlog(page, {
            title: 'a new title 3',
            author: 'giannis',
            url: 'https://fullstackopen.com/en/part5',
        })
        await expect(page.getByRole('button', { name: 'view' })).toHaveCount(3)

        const viewButtons = page.getByRole('button', { name: 'view' })

        while ((await viewButtons.count()) > 0) {
            await viewButtons.first().click()
        }

        // click first blog 1 time
        await likeBlogWithTitle(page, 'a new title 1')

        // // click second blog 3 times
        await likeBlogWithTitle(page, 'a new title 2')
        await likeBlogWithTitle(page, 'a new title 2')
        await likeBlogWithTitle(page, 'a new title 2')

        // // click third blog 2 times
        await likeBlogWithTitle(page, 'a new title 3')
        await likeBlogWithTitle(page, 'a new title 3')

        // sort by like
        const sortButton = page.getByRole('button', {
            name: 'sort by likes descending',
        })
        await sortButton.click()

        // ensure blog with title 'a new title 2' is first
        const firstBlog = page.locator('.blog').first()
        await expect(firstBlog).toContainText('a new title 2')
    })
})
