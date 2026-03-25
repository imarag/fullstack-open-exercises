const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
    await page.getByLabel('username').fill(username)
    await page.getByLabel('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, newBlog) => {
    await page.getByLabel('title').fill(newBlog.title)
    await page.getByLabel('author').fill(newBlog.author)
    await page.getByLabel('url').fill(newBlog.url)
    await page.getByRole('button', { name: 'create' }).click()
    const blog = page.locator('.blog').filter({ hasText: newBlog.title })
    await expect(blog).toBeVisible()
}

const likeBlogWithTitle = async (page, blogTitle) => {
    const blog = page.locator('.blog').filter({
        hasText: blogTitle,
    })
    await expect(blog).toHaveCount(1)
    await expect(blog).toBeVisible()

    const likeButton = blog.getByRole('button', { name: 'like' })
    await expect(likeButton).toBeVisible()
    const likeValue = blog.locator('.likes-value')
    await expect(likeValue).toBeVisible()

    const beforeString = await likeValue.textContent()

    await likeButton.click()
    await expect(likeValue).toContainText(`${Number(beforeString) + 1}`)
}

module.exports = { loginWith, createBlog, likeBlogWithTitle }
