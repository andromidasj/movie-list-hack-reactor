# 🎬 Trakt Movie List 📱

_(Catchy name pending...)_

<h2 align="center">Welcome to Movie Night :popcorn::cup_with_straw:</h2>

<div style="display:flex" align="center">
   <img src="https://ik.imagekit.io/joshandromidas/github-assets/CA1502D0-8661-46F7-9FE0-3546B590471F_1_102_o_FJv15f3of.jpeg?ik-sdk-version=javascript-1.4.3&updatedAt=1652884803036" width="18%"/>
   <img src="https://ik.imagekit.io/joshandromidas/github-assets/E12F3F59-BC1F-4EEB-BBED-A02C55A799B9_1_102_o_wYhLiA3c0.jpeg?ik-sdk-version=javascript-1.4.3&updatedAt=1652885339848" width="18%"/>
   <img src="https://ik.imagekit.io/joshandromidas/github-assets/825894E3-E9AD-4D9B-B5B8-A24042E42F72_1_102_o_jLTy7bQ1n.jpeg?ik-sdk-version=javascript-1.4.3&updatedAt=1652885339890" width="18%"/>
   <img src="https://ik.imagekit.io/joshandromidas/github-assets/740E43C0-BC4E-4086-91AC-BC5013379673_1_102_o_Yg1iQC2Ov.jpeg?ik-sdk-version=javascript-1.4.3&updatedAt=1652884803117" width="18%"/>
   <img src="https://ik.imagekit.io/joshandromidas/github-assets/9D23C40C-9789-482D-8E7E-729B6538ED3B_1_102_o_UJdAslEg6.jpeg?ik-sdk-version=javascript-1.4.3&updatedAt=1652884803318" width="18%"/>
</div>

## ❓ What is it?

This project started from a love for movies and the desire to answer the question that my wife and I ask each other very often — _what movie should we watch tonight?_

During my time at [Hack Reactor](https://www.hackreactor.com/), we had the chance to work on a 2-day sprint that could be any project we decided to build. I chose to work on this **mobile-first** movie list web application, delivering the minimum viable product after the two days. Now, I’m refactoring and improving it.

Building this app has been a _huge_ learning experience for me! It is created using awesome tools like:

- React
- Express
- React Router
- React Query
- SASS
- [Mantine UI](https://mantine.dev/)
- [Trakt API](https://trakt.docs.apiary.io/)
- [TMDB API](https://developers.themoviedb.org/3)
- [Zustand](https://github.com/pmndrs/zustand)

## 🔥 Features

- Sign in with Trakt
- Create, remove, and edit lists stored in your Trakt account
- Mark movies as _Watched_ or _To Watch_
- Search movies
- Extensive movie details — overview, trailer, actors, watch providers, & more!
- Settings — select which streaming providers you’d like to see

## 💻 How to use

This project has also been dockerized, and you can find the image and installation instructions at [joshandromidas/trakt-movie-list](https://hub.docker.com/r/joshandromidas/trakt-movie-list) to deploy it yourself!

## 🗺️ Roadmap

As of right now, this app has been visually designed exclusively for mobile. In other words, it _does_ work on desktop but it _doesn’t_ look pretty — yet. In the coming weeks, I’m considering:

- [ ] Add desktop UI from the ground-up, implementing a responsive design that looks great on all devices
- [ ] Add other visual goodies like dark/light mode
- [ ] Add a database connection to store user preferences more robustly
- [ ] Fix bugs & improve speed
