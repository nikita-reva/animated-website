let controller
let slideScene
let pageScene
let detailScene

let mouse = document.querySelector('.cursor')
let mouseText = mouse.querySelector('span')
let burger = document.querySelector('.burger')

function animateSlides() {
	// Initialize controller
	controller = new ScrollMagic.Controller()
	// Select elements
	const slides = document.querySelectorAll('.slide')
	const nav = document.querySelector('.nav-header')
	// Loop over each slide
	slides.forEach((slide, index, slides) => {
		// Select elements inside of each slide
		const revealImg = slide.querySelector('.reveal-img')
		const img = slide.querySelector('img')
		const revealText = slide.querySelector('.reveal-text')
		// GSAP
		// Create a timeline for each slide
		const slideTl = gsap.timeline({
			defaults: { duration: 1 },
			ease: 'power2.inOut',
		})
		// Add animations
		slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' })
		slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1')
		slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75')
		// Create Scene
		slideScene = new ScrollMagic.Scene({
			triggerElement: slide,
			triggerHook: 0.25,
			reverse: false,
		})
			.setTween(slideTl)
			// .addIndicators({
			// 	colorStart: 'white',
			// 	colorTrigger: 'white',
			// 	name: 'slide',
			// })
			.addTo(controller)
		// New animation
		const pageTl = gsap.timeline()
		let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1]
		pageTl.fromTo(nextSlide, { y: '0%' }, { y: '50%' })
		pageTl.fromTo(
			slide,
			{ opacity: 1, scale: 1 },
			{ opacity: 0, scale: 0.5 }
		)
		pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5')
		pageScene = new ScrollMagic.Scene({
			triggerElement: slide,
			duration: '100%',
			triggerHook: 0,
		})
			// .addIndicators({
			// 	colorStart: 'white',
			// 	colorTrigger: 'white',
			// 	name: 'page',
			// 	indent: 200,
			// })
			.setPin(slide, { pushFollowers: false })
			.setTween(pageTl)
			.addTo(controller)
	})
}

// Cursor animations
function cursor(e) {
	mouse.style.top = e.pageY + 'px'
	mouse.style.left = e.pageX + 'px'
}

function activeCursor(e) {
	const item = e.target
	if (item.id === 'logo' || item.classList.contains('burger')) {
		mouse.classList.add('nav-active')
	} else {
		mouse.classList.remove('nav-active')
	}

	if (item.classList.contains('explore')) {
		mouse.classList.add('explore-active')
		gsap.to('.title-swipe', 2, { y: '0%' })
		// mouseText.innerText = 'Tap'
	} else {
		mouse.classList.remove('explore-active')
		gsap.to('.title-swipe', 1, { y: '100%' })
		// mouseText.innerText = ' '
	}
}

// Nav animations
function navToggle(e) {
	if (!e.target.classList.contains('active')) {
		e.target.classList.add('active')
		gsap.to('.line-1', 0.5, { rotate: 45, y: 4.2, background: 'black' })
		gsap.to('.line-2', 0.5, { rotate: -45, y: -4.2, background: 'black' })
		gsap.to('#logo', 0.5, { color: 'black' })
		gsap.to('.nav-bar', 1, { clipPath: 'circle(2500px at 100% -10%)' })
		document.body.classList.add('hide')
	} else {
		e.target.classList.remove('active')
		gsap.to('.line-1', 0.5, { rotate: 0, y: 0, background: 'white' })
		gsap.to('.line-2', 0.5, { rotate: 0, y: 0, background: 'white' })
		gsap.to('#logo', 0.5, { color: 'white' })
		gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' })
		document.body.classList.remove('hide')
	}
}

const logo = document.querySelector('#logo')

// Barba.js page transitions
barba.init({
	views: [
		{
			namespace: 'home',
			beforeEnter() {
				animateSlides()
				logo.href = './index.html'
			},
			beforeLeave() {
				slideScene.destroy()
				pageScene.destroy()
				controller.destroy()
			},
		},
		{
			namespace: 'fashion',
			beforeEnter() {
				logo.href = '../index.html'
				detailAnimation()
			},
			beforeLeave() {
				detailScene.destroy()
				controller.destroy()
			},
		},
	],
	transitions: [
		{
			leave({ current, next }) {
				let done = this.async()
				// Leave animation
				const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
				tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 })
				tl.fromTo(
					'.swipe',
					0.75,
					{ x: '-100%' },
					{ x: '0%', onComplete: done },
					'-=0.5'
				)
			},
			enter({ current, next }) {
				let done = this.async()
				// Scroll to the top
				window.scrollTo(0, 0)
				// Enter Animation
				const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })
				tl.fromTo(
					'.swipe',
					0.75,
					{ x: '0%' },
					{ x: '100%', stagger: 0.25, onComplete: done },
					'-=0.5'
				)
				tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 })
				tl.fromTo(
					'.nav-header',
					{ y: '-100%' },
					{ y: '0%', ease: 'power2.inOut' },
					'-=1.5'
				)
			},
		},
	],
})

function detailAnimation() {
	controller = new ScrollMagic.Controller()
	const slides = document.querySelectorAll('.detail-slide')
	slides.forEach((slide, index, slides) => {
		slideTl = gsap.timeline({ defaults: { duration: 1 } })
		let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1]
		const nextImg = nextSlide.querySelector('img')
		slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 })
		slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, '-=1')
		slideTl.fromTo(nextImg, { x: '50%' }, { x: '0%' })
		// Scene
		detailScene = new ScrollMagic.Scene({
			triggerElement: slide,
			duration: '100%',
			triggerHook: 0,
		})
			.setPin(slide, { pushFollowers: false })
			.setTween(slideTl)
			// .addIndicators({
			// 	colorStart: 'white',
			// 	colorTrigger: 'white',
			// 	name: 'detailScene',
			// })
			.addTo(controller)
	})
}

// Event Listeners
burger.addEventListener('click', navToggle)
window.addEventListener('mousemove', cursor)
window.addEventListener('mouseover', activeCursor)
