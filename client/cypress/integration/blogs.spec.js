const dummy = { username: 'dummy', name: 'Tyhäm Tester', password: 'salasana' }

const blog = {
  _id: "5a422a851b54a676234d17f7",
  title: "React patterns",
  author: "Michael Chan",
  url: "https://reactpatterns.com/",
  likes: 7,
  user: dummy
}


const dropDatabase = () =>
  cy.request('POST', 'http://localhost:3000/api/testing/drop-database')

const initDatabase = () =>
  cy.request('POST', 'http://localhost:3000/api/testing/init-database')

const createDummyUser = () =>
  cy.request('POST', 'http://localhost:3000/api/users/', dummy)

describe('Blogs app', function () {

  describe('Login', function () {

    beforeEach(function () {
      cy.visit('http://localhost:3000')
    })

    it('form is shown', function () {
      cy.get('#login-form')
    })

    it('succeeds with correct credentials', function () {
      const { username, password, name } = dummy
      cy.get('#username-input').type(username)
      cy.get('#password-input').type(password)
      cy.get('#login-button').click()
      cy.contains(`${name} logged in.`)
    })

    it('user is informed when providing an invalid password', function () {
      const { username, password, name } = dummy
      cy.get('#username-input').type(username)
      cy.get('#password-input').type('väärin')
      cy.get('#login-button').click()
      cy.get('.notification-error')
      cy.contains(`Password incorrect.`)
    })

  })

  describe('Blogs', function () {

    beforeEach(function () {
      cy.login(dummy)
    })

    it('front page can be opened', function () {
      cy.visit('http://localhost:3000')
      cy.contains('No blogs to display!' || 'Blogs')
    })

    it('A blog can be created', function () {
      const { title, author, url } = blog
      create(blog);
      cy.contains(title)
      cy.contains(author)
      function create(blog) {
        const { title, author, url } = blog
        cy.get('#new-blog-button').click()
        cy.get('#title-input').type(title)
        cy.get('#author-input').type(author)
        cy.get('#url-input').type(url)
        cy.get('#add-blog-button').click()
      }
    })

    describe('After blog creation', function () {

      before(function () {
        dropDatabase()
        initDatabase()
        cy.login(dummy)
        cy.reload()
      })

      it('blogs are in descending order by likes from top to bottom', function () {
        const isDescending = (arr) => arr.every((x, i) => i === 0 || x <= arr[i - 1]);
        cy.get('.likes-badge').then(likes => cy.expect(isDescending(Array.from(likes))).to.be.true)
      })

      it('blog can be viewed 👀', function () {
        cy.get('.blog-link').first().click()
      })

      it('blog can be liked 😂👌', function () {

        cy.intercept('/api/blogs', []).as('getBlogs')

        cy.get('.likes-badge').then(badge => {
          const before = +badge.text()
          cy.get('#like-blog-button').click().then(() => {
            cy.wait('@getBlogs')
            const after = +badge.text()
            expect(after).to.eq(before + 1)
          })
        })
        cy.get('.notification-success')
      })

      it('blog can be removed 🚯', function () {
        cy.get('#remove-blog-button').click()
        cy.get('.notification-success')
      })

    })

  })

})