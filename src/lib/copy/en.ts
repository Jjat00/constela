/**
 * El banco de hechos en inglés.
 *
 * NO ES UNA TRADUCCIÓN, y la diferencia importa. Un calco del español habría
 * heredado sus palabras clave, y las palabras por las que se busca esta
 * categoría en inglés no son las mismas frases dichas en otro idioma: se
 * escribe «event networking app», «how to network at a conference», «QR code
 * business card». Las páginas inglesas están escritas alrededor de esas
 * frases, con la misma estructura y los mismos hechos que las españolas —eso
 * es lo que el `hreflang` promete— pero con el vocabulario con el que la gente
 * las buscaría.
 *
 * Se conserva intacta la regla que gobierna `es.ts`: **ni una estadística, ni
 * un testimonio, ni un competidor con nombre.** Traducir es exactamente el
 * momento en que se cuela un «studies show that 88 % of business cards…»
 * porque en inglés suena bien y nadie va a pedir la fuente. Aquí no hay
 * ninguno.
 *
 * Ortografía americana (organizer, digitize): es la mayoritaria en las
 * búsquedas de esta categoría y la que espera el lector por defecto.
 *
 * Y una honestidad más, que en español no hace falta: **la aplicación todavía
 * habla español.** El sitio está en los dos idiomas; el producto al que lleva
 * la puerta, no. Se dice en `chrome.avisoIdiomaApp`, en la portada, antes de
 * que nadie entre — no después.
 */

import type { Copy } from "./tipos";

export const EN: Copy = {
  chrome: {
    entrar: "Sign in →",
    entrarConstelacion: "Go to your constellation",
    volverPortada: "Constela — back to the home page",
    migasAria: "Breadcrumb",
    migasInicio: "Constela",
    pieAria: "Site links",
    pieLegalAria: "Legal links",
    portada: "Home",
    privacidad: "Privacy",
    terminos: "Terms",
    copyright: "© 2026 Constela",
    gratis: "Free · nothing to install",
    idioma: {
      aria: "Language",
      otro: "ES",
      otroNombre: "Español",
    },
    avisoIdiomaApp:
      "The app itself still speaks Spanish. This site is in both languages; the product below is the real interface, and it hasn't been translated yet — the tags you see are the event's real catalog, untouched.",
    google: {
      continuar: "Continue with Google",
      abriendo: "Opening Google…",
      error: "Google didn't respond. Try again.",
    },
    ficha: {
      rol: "[ YOUR ROLE ]",
      intereses: "[ INTERESTS · OPTIONAL ]",
      intencion: "[ INTENT · OPTIONAL ]",
      buscaRol: "search for your role, or type it",
      buscaIntereses: "what do you want to talk about?",
      buscaIntencion: "what did you come for?",
      verRestantes: "see the other {n}",
    },
  },

  portada: {
    marca: {
      nombre: "Constela",
      tagline: "Networking you can finally see",
      definicion:
        "You scan the QR code of the person you just met at an event, and the network draws itself live, in front of the whole room.",
      titular: { antes: "Your network is", destacado: "your universe." },
    },

    hero: {
      mono: "Constela · for any event",
      ledeFuerte: "Constela is networking you can finally see.",
      verso: "Every person is a star, every connection, a constellation.",
      tiempo: "8 seconds",
    },

    video: {
      etiqueta: "In motion",
      titulo: "Constela, in 35 seconds.",
      texto:
        "The same story, start to finish, without touching anything. Everything in the video is the application: not a single screen is a mockup.",
      marco: "constela · walkthrough",
      pie: "35 s · no sound",
    },

    pasos: {
      mono: "How it works",
      titulo:
        "Three gestures, none of them remote: the connection exists because you met.",
      howTo: "How to connect with someone on Constela",
      lista: [
        {
          n: "01",
          titulo: "You scan",
          texto:
            "You open the personal QR code of whoever is standing in front of you. That gesture puts you inside the event and connects the two of you, in one movement — and right there, one tap notes where the encounter happened.",
        },
        {
          n: "02",
          titulo: "You appear",
          texto:
            "You're born as a star inside the constellation, with your role and what you came looking for. One tap, and you can skip it for now.",
        },
        {
          n: "03",
          titulo: "The network draws itself",
          texto:
            "Every encounter adds a filament. The constellation of the event grows live, and the whole event sees it — not just you.",
        },
      ],
    },

    vocabulario: {
      mono: "Vocabulary",
      titulo: "The cosmos isn't decoration: it's the model.",
      lista: [
        {
          termino: "Star",
          dominio: "A person at the event",
          texto:
            "Its spectral class is stable: the same person always shines the same. The more connections, the greater the magnitude.",
        },
        {
          termino: "Constellation",
          dominio: "The full network of the event",
          texto:
            "Not «your network up to second degree»: the entire graph, visible to every attendee.",
        },
        {
          termino: "Triadic closure",
          dominio: "Three people who all know each other",
          texto:
            "The triangle that lights up when two of your contacts turn out to know each other. It's the social moment of the product.",
        },
        {
          termino: "Galaxy",
          dominio: "An event",
          texto:
            "Every personal QR code is pinned to a galaxy: scanning someone joins you to theirs, in a chain.",
        },
      ],
    },

    noHace: {
      mono: "What you won't find",
      lista: [
        "No «add» button",
        "No pending requests",
        "No connecting from the couch",
        "No levels, points or badges",
      ],
    },

    preguntas: {
      mono: "Questions",
      lista: [
        {
          q: "Does the event organizer have to install it?",
          a: "No. Constela spreads person to person: you join an event by scanning someone who is already inside.",
        },
        {
          q: "Can I connect with someone I haven't met?",
          a: "No, and that's on purpose. A connection is only born when you open the other person's personal QR code. Tapping their star opens their profile; it never connects you.",
        },
        {
          q: "Who can see the constellation?",
          a: "Everyone at the event. The collective view of the network is the product, not an extra.",
        },
        {
          q: "How do I remember what I talked about with each person?",
          a: "By noting it in the moment: when you connect, the same screen offers one-tap contexts —«at the talk», «at the afterparty»— plus free text, and later you edit the note by tapping their star. It's private: only you can see it, not even the other person.",
        },
        {
          q: "How do I get in?",
          a: "With your Google account, and that's it. The rest of the profile is optional and can wait.",
        },
      ],
    },

    bienvenida: {
      etiqueta: "First",
      titulo: "You sign in with Google and say who you are.",
      texto:
        "Your role, the topics you want to talk about, and what you came to the event for. One screen, under a minute, once: that's your whole star.",
      textoDos:
        "It isn't a profile to decorate. Those three signals are the language the rest of the event uses to decide whether to walk up to you — and the one you use to decide who to look for.",
      pie: "this is the real welcome screen · the tags come from the sample event",
    },

    mapa: {
      etiqueta: "Then",
      titulo: "And the whole event becomes readable.",
      texto:
        "Every attendee is a star; every QR code you scan, a line between two. Filter by role, interest or intent and whatever doesn't match dims out: the map never reshuffles, so you never lose track of who was where.",
      textoDos:
        "That's where you see what a crowded room hides: who's hiring, who works on the same thing you do, and the blue triangles of people who already know each other — which is where you ask for an introduction. And on the stars you've already crossed paths with, your note of that encounter: where it was, what you talked about. Only you can see it.",
      marco: "constellation · sample event",
      pie: "tap a chip, search a name, open a star",
    },

    siguiente: {
      mono: "Keep reading",
      titulo: "If you're still deciding how to do this.",
      enlaces: [
        {
          a: "categoria",
          titulo: "What an event networking app is, and how they differ",
          texto:
            "The four ways to swap contacts at an event —paper, LinkedIn, the organizer's app and scanning in person— compared by what each one costs you in the moment and what it leaves behind.",
        },
        {
          a: "guia",
          titulo: "How to network at an event without it wearing you out",
          texto:
            "What goes wrong before the conversation starts, why the contacts you take home almost never turn into anything, and what to do differently next time you walk into a room full of strangers.",
        },
      ],
    },

    cierre: { titulo: "Come in through a star." },

    demo: {
      reproducir: "Play",
      pausar: "Pause",
      videoAria:
        "Constela in 35 seconds: how the constellation of an event draws itself",
      encendiendo: "lighting up the constellation…",
      filtrar: "Filter the constellation with this ↓",
      eligeRol: "Pick your role",
      senal: "signal chosen",
      senales: "signals chosen",
      seApaga: "below, whatever doesn't match dims out",
      pistaVacia: "pick at least your role to see what it does",
      estrellas: "stars",
      conexiones: "connections",
      tusEventos: "your events",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // /en/event-networking-app — la página de categoría
  // ───────────────────────────────────────────────────────────────────────────

  categoria: {
    etiqueta: "The category",
    titulo: "What is an event networking app",
    h1: "An event networking app has exactly one job: making sure you don't lose the people you actually met.",
    clave:
      "An event networking app is a tool that records the encounters that happen at an in-person event and turns them into contacts you can find again afterwards. There are two kinds: the ones that digitize the exchange of details —a QR code instead of a paper business card— and the ones that also draw the network forming between the people in the room.",
    descripcion:
      "What an event networking app is, the four ways to swap contacts at one, and what changes when the network of the event becomes visible. Constela is free.",

    problema: {
      mono: "The problem",
      titulo: "The problem isn't swapping details. It's the next morning.",
      parrafos: [
        "Swapping contact details at an event has been solved for decades: a business card, a phone number read out loud, a LinkedIn handle spelled letter by letter. What none of those gestures solves is the next morning, when you have eight names and no way to remember which one worked on the thing you care about.",
        "A contact saved without context is almost the same as no contact at all. The card doesn't know what you talked about, LinkedIn doesn't know where you met, and a number saved as «Andrés conference» says nothing you could use to write a week later without sounding like a cold pitch.",
        "And there's an earlier problem, a bigger one that almost nobody talks about: in a room with two hundred people you don't know who to walk up to. The information that would settle it —who's hiring, who does what you do, who came looking for a co-founder— exists, but it's spread across two hundred heads and there's no way to see it.",
      ],
    },

    tabla: {
      mono: "Comparison",
      titulo: "The four ways to swap contacts at an event",
      caption:
        "The four ways to swap contacts at an in-person event, compared by what each costs you in the moment and what it leaves behind afterwards.",
      columnas: ["Method", "What it costs in the moment", "What's left after"],
      filas: [
        {
          metodo: "Paper business card",
          cuesta:
            "No friction at all: handed over in a second, works with no battery and no signal.",
          queda:
            "A piece of card with a job title and an email. Neither the context of the conversation nor any way of knowing who else knows that person.",
        },
        {
          metodo: "Looking each other up on LinkedIn right there",
          cuesta:
            "Half a minute per person, on bad reception, with the name misspelled and three identical profiles to choose from.",
          queda:
            "One more connection in a list of thousands, with no mark of where it came from. Six months later you won't know if you met or if they accepted a cold request.",
        },
        {
          metodo: "The organizer's app",
          cuesta:
            "Downloading it, creating an account and filling in a profile before the event starts.",
          queda:
            "A directory of attendees, for as long as the event lasts. It exists only because the organizer decided to pay for it, and it dies with this year's edition.",
        },
        {
          metodo: "Scanning the other person's personal QR code",
          cuesta:
            "One scan. Nothing to install, and the organizer doesn't have to be involved.",
          queda:
            "A connection that could only have been born in person, inside the map of the entire event: who everyone is, who knows who, and where to ask for an introduction.",
          nuestro: true,
        },
      ],
    },

    diferencia: {
      mono: "The difference",
      titulo: "What changes when the network becomes visible",
      parrafos: [
        "Almost every tool in this category treats networking as a storage problem: capture the other person's details and file them properly. Constela treats it as a visibility problem. The question it answers isn't «how do I save this contact?», it's «who should I be walking up to in this room?».",
        "That's why the network of the event isn't private. Every attendee sees the full graph: the stars are people, the lines are encounters that actually happened, and the triangles are groups of three who already know each other. Seeing a triangle with someone you want to talk to hanging off it is, quite literally, seeing where to ask for an introduction.",
        "The cost of that design is deliberate: you cannot connect with anyone at a distance. There's no add button, no pending requests, no way to rack up contacts from the couch. A line between two stars means those two people stood in front of each other, and that guarantee would break the moment a button existed.",
      ],
      cruce: {
        antes:
          "If what you're after isn't comparing tools but walking out of the next event with more than you walked in with, the ",
        enlace: "guide to networking at in-person events",
        despues: " covers the how.",
        a: "guia",
      },
    },

    preguntas: {
      mono: "Questions",
      titulo: "What everyone asks before installing anything.",
      lista: [
        {
          q: "How much does an event networking app cost?",
          a: "It depends on who's paying. Platforms an organizer signs up for are charged per event or per attendee, usually bundled into an event management package. Constela doesn't charge: it's free for any attendee and has no paid plans, because nobody buys it — the people at the event install it by scanning each other.",
        },
        {
          q: "Does the event organizer have to have adopted it?",
          a: "Not with Constela. You join the event by scanning the QR code of someone already inside, and from then on your own QR code is the door for the next person. That's the practical difference with organizer platforms: those exist because someone bought them, this one exists because two people scanned each other.",
        },
        {
          q: "Do I have to install anything?",
          a: "No. Constela is a web application: it opens in your phone's browser when you scan a QR code. You can save it to your home screen if you want it to behave like an app, but nobody has to go through an app store in the middle of an event.",
        },
        {
          q: "Who can see my data?",
          a: "People at the event see your name, your role and the topics you said you're interested in — that's what makes someone decide to come over. Your direct contact channels, like WhatsApp, only show up for people you actually met in person. The full detail is in the privacy policy.",
        },
        {
          q: "Does it work for small events?",
          a: "Yes, and the network reads better the smaller the event is: in a group of thirty the whole constellation fits on one screen and the triangles are obvious at a glance. At large events the value shifts to the filters, which dim everything that doesn't match what you're looking for.",
        },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // /en/networking-at-events — la guía
  // ───────────────────────────────────────────────────────────────────────────

  guia: {
    etiqueta: "The guide",
    titulo: "How to network at an in-person event",
    h1: "How to network at an event without it wearing you out.",
    clave:
      "Networking at an in-person event is, in practice, three problems in a row: who to walk up to, how to start the conversation, and what to do with it afterwards. Almost all the advice out there attacks the second one. The two that actually decide the outcome are the first and the third.",
    descripcion:
      "A practical guide to networking at in-person events and conferences: who to approach, how to start, and what to do afterwards. No sales tricks, no LinkedIn formulas.",
    revisada: "Reviewed on August 4, 2026",

    tiempos: [
      {
        mono: "Before",
        titulo: "Before: decide one single thing",
        parrafos: [
          "You don't need a strategy. You need one sentence: what you're going for. «I'm looking for a technical co-founder», «I want to understand how this gets priced», «I'm here to be seen so someone hires me». One sentence, said out loud before you walk in.",
          "It does two things, and neither of them is motivational. The first is that it filters: with a clear intent, half the possible conversations in the room stop mattering and you can give twice the time to the other half. The second is that it answers the one question everybody asks at an event —«so what brings you here?»— without you having to improvise a speech about your company.",
          "If the event gives you any way to state that intent in advance, state it. It's information that helps everyone else more than it helps you: someone looking for exactly what you offer needs to be able to find you.",
        ],
      },
      {
        mono: "During",
        titulo: "During: the hard part is who, not how",
        parrafos: [
          "Almost all the literature on networking teaches you how to start conversations. That's the easy part. The hard part is that in a crowded room the information that would tell you who to talk to is spread across two hundred heads and can't be seen: who's hiring, who works on the same thing you do, who already knows the person you're interested in.",
          "Without that information, most people do the same thing: they stay with whoever they already knew, or they walk up to whoever is standing alone because it's easier. Both are decisions made out of comfort rather than judgment, and both explain why you leave so many events feeling like you got nothing out of them.",
          "What does work and costs nothing: ask about the third person. «Do you know anyone here working on this?» turns one conversation into two, and an introduction made by someone trusted starts at a level a cold conversation never reaches. It's the same principle behind the triangles lighting up in Constela: three people who already know each other are the shortest path to a fourth.",
        ],
      },
      {
        mono: "After",
        titulo: "After: a contact without context is worth nothing",
        parrafos: [
          "The next day is where almost everything is lost. Not because people are too lazy to write, but because writing requires remembering, and what an event leaves you —a card, a name in your phone, an accepted connection— doesn't contain what you'd need to remember: what you talked about, what that person was looking for, why it was worth continuing.",
          "The old, good trick is to write one line about the conversation on the back of the card, right there. It works, and it still works. The problem is that nobody does it standing up, with a drink in one hand and a phone in the other.",
          "That's why the record has to happen in the same gesture as the encounter, or it doesn't happen. If connecting requires a separate step —open an app, search a name, send a request— that step gets postponed until it stops making sense. If connecting IS the gesture of scanning someone standing in front of you, then who, where and when are already recorded, without anyone having had to remember a thing.",
        ],
      },
    ],

    errores: {
      mono: "What doesn't work",
      titulo: "Four things that don't work",
      lista: [
        "Handing out business cards in bulk. Twenty contacts with no context are worth less than three conversations you remember.",
        "Selling in the first sentence. Nobody at an event is in buying mode; whoever opens by selling becomes the person everyone else walks away from.",
        "Leaving the follow-up for «when I have time». Context evaporates in days, and with it the only reason that message wouldn't be spam.",
        "Sticking with the people you already know. It's the most comfortable decision in the room and the only one that guarantees the event was worth nothing to you.",
      ],
    },

    preguntas: {
      mono: "Questions",
      titulo: "The ones people ask before walking into the room.",
      lista: [
        {
          q: "How do I start a conversation at an event if I don't know anyone?",
          a: "With a question about the event, not about the person: which talk they liked best, whether it's their first time, what brought them. Anyone can answer those without feeling interrogated, and the answer usually hands you, for free, the information you need to decide whether the conversation is worth continuing.",
        },
        {
          q: "How many people should I meet at an event?",
          a: "Fewer than you think. Three conversations you can remember and continue are worth more than twenty contacts you won't be able to place on Monday. Volume only makes sense if you have a way to record the context of each encounter, and standing in a crowded room almost nobody does.",
        },
        {
          q: "What should I do with the contacts after the event?",
          a: "Write within the first forty-eight hours, while the conversation is still fresh on both sides, and say what you talked about before proposing anything. A message that opens by recalling the context isn't a cold message; one that opens by proposing a meeting is.",
        },
        {
          q: "Is networking any use if I'm shy?",
          a: "Yes, and usually more: long conversations with few people pay off better than the circuit of greeting everybody. What actually helps isn't forcing yourself to be extroverted, it's reducing uncertainty — knowing in advance who makes sense to approach turns a social problem into an information problem.",
        },
        {
          q: "Is online networking as good as in person?",
          a: "It's good for maintaining, not for starting. A message to a stranger on a social network competes with fifty identical ones; a ten-minute conversation face to face competes with nothing. What online tools do well is sustain afterwards what started in person.",
        },
      ],
    },

    cruce: {
      mono: "And if you were after a tool",
      antes:
        "This guide works with a notebook and four paper business cards. If you were also comparing tools, the page on ",
      enlace: "what an event networking app is",
      despues: " compares the four methods by what each one leaves behind.",
      a: "categoria",
    },
  },
};
