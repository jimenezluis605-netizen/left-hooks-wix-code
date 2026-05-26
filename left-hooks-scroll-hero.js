/*
LEFT HOOKS DESIGN — WIX CUSTOM ELEMENT SCROLL-SCRUB HERO

Tag name for Wix:
left-hooks-scroll-hero

Use this file as the source URL for your Wix Custom Element.
Do NOT paste this into Wix Page Code.

Recommended Wix Custom Element height:
Desktop: 2000px–2200px
Tablet: 1700px–1900px
Mobile: 1450px–1650px

Important fix:
This version does NOT force the element to 2200px from inside the code.
Wix controls the height. The code fills whatever height Wix gives the element.
*/

class LeftHooksScrollHero extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.video = null;
    this.duration = 0;
    this.raf = null;
    this.isReady = false;

    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback() {
    this.render();

    this.video = this.shadowRoot.querySelector("#lhHeroVideo");

    if (!this.video) return;

    this.video.pause();
    this.video.currentTime = 0;
    this.video.muted = true;
    this.video.playsInline = true;

    this.video.addEventListener("loadedmetadata", () => {
      this.duration = this.video.duration || 0;
      this.isReady = true;
      this.updateVideoFrame();
    });

    this.video.addEventListener("canplay", () => {
      this.updateVideoFrame();
    });

    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleResize);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);

    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
  }

  handleScroll() {
    this.requestUpdate();
  }

  handleResize() {
    this.requestUpdate();
  }

  requestUpdate() {
    if (this.raf) return;

    this.raf = requestAnimationFrame(() => {
      this.updateVideoFrame();
      this.raf = null;
    });
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  updateVideoFrame() {
    if (!this.video || !this.duration || !this.isReady) return;

    const rect = this.getBoundingClientRect();
    const elementHeight = this.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollDistance = elementHeight - viewportHeight;

    if (scrollDistance <= 0) return;

    const progress = this.clamp(-rect.top / scrollDistance, 0, 1);
    const targetTime = progress * this.duration;

    if (Math.abs(this.video.currentTime - targetTime) > 0.025) {
      this.video.currentTime = targetTime;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

        :host {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 100%;
          background: #0b0d0e;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .lh-scroll-hero {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 100%;
          background: #0b0d0e;
          color: #f7f4ef;
          overflow: visible;
        }

        .lh-sticky-stage {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        .lh-hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          background: #000;
        }

        .lh-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 76% 18%, rgba(200, 155, 94, 0.22), transparent 36%),
            linear-gradient(90deg, rgba(8, 10, 11, 0.92) 0%, rgba(8, 10, 11, 0.74) 36%, rgba(8, 10, 11, 0.25) 72%, rgba(8, 10, 11, 0.50) 100%),
            linear-gradient(180deg, rgba(8, 10, 11, 0.20) 0%, rgba(8, 10, 11, 0.54) 100%);
        }

        .lh-content {
          position: relative;
          z-index: 2;
          width: min(1120px, calc(100% - 40px));
          height: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          padding: 96px 0;
        }

        .lh-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          color: #c89b5e;
          font-family: Inter, Arial, sans-serif;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .lh-eyebrow::before {
          content: "";
          width: 28px;
          height: 1px;
          background: #c89b5e;
          display: inline-block;
        }

        h1 {
          max-width: 860px;
          margin: 0;
          font-family: "DM Sans", Arial, sans-serif;
          font-size: clamp(44px, 7.4vw, 92px);
          font-weight: 900;
          line-height: 0.96;
          letter-spacing: -0.065em;
          color: #f7f4ef;
        }

        p {
          max-width: 690px;
          margin: 26px 0 0;
          font-family: Inter, Arial, sans-serif;
          font-size: clamp(17px, 1.8vw, 22px);
          font-weight: 400;
          line-height: 1.55;
          color: #c7bfb3;
        }

        .lh-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 34px;
        }

        .lh-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 14px 24px;
          border-radius: 999px;
          font-family: Inter, Arial, sans-serif;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .lh-btn-primary {
          background: #c89b5e;
          color: #111;
          box-shadow: 0 14px 35px rgba(200, 155, 94, 0.25);
        }

        .lh-btn-primary:hover {
          transform: translateY(-2px);
          background: #d8ad72;
        }

        .lh-btn-secondary {
          color: #f7f4ef;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
        }

        .lh-btn-secondary:hover {
          border-color: #c89b5e;
          color: #c89b5e;
        }

        .lh-note {
          margin-top: 18px;
          font-family: Inter, Arial, sans-serif;
          font-size: 14px;
          color: rgba(247, 244, 239, 0.72);
        }

        .lh-scroll-pill {
          position: absolute;
          z-index: 3;
          right: max(24px, calc((100vw - 1120px) / 2));
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 999px;
          background: rgba(8, 10, 11, 0.58);
          backdrop-filter: blur(14px);
          color: #f7f4ef;
          font-family: Inter, Arial, sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .lh-pill-1 { top: 38%; }
        .lh-pill-2 { top: 62%; }
        .lh-pill-3 { top: 86%; }

        @media (max-width: 900px) {
          .lh-overlay {
            background:
              radial-gradient(circle at 60% 20%, rgba(200, 155, 94, 0.18), transparent 36%),
              linear-gradient(180deg, rgba(8, 10, 11, 0.62) 0%, rgba(8, 10, 11, 0.54) 48%, rgba(8, 10, 11, 0.88) 100%);
          }

          .lh-content {
            width: min(100% - 32px, 760px);
            justify-content: flex-end;
            padding-bottom: 92px;
          }

          h1 {
            font-size: clamp(40px, 12vw, 64px);
            line-height: 0.98;
          }

          p {
            font-size: 17px;
            max-width: 560px;
          }

          .lh-scroll-pill {
            left: 16px;
            right: auto;
            font-size: 13px;
          }
        }

        @media (max-width: 560px) {
          .lh-content {
            width: min(100% - 28px, 520px);
            padding-bottom: 64px;
          }

          .lh-eyebrow {
            font-size: 11px;
            letter-spacing: 0.11em;
          }

          .lh-actions {
            width: 100%;
          }

          .lh-btn {
            width: 100%;
          }

          .lh-note {
            font-size: 13px;
          }

          .lh-scroll-pill {
            display: none;
          }
        }
      </style>

      <section class="lh-scroll-hero">
        <div class="lh-sticky-stage">
          <video
            id="lhHeroVideo"
            class="lh-hero-video"
            src="https://video.wixstatic.com/video/048c4f_c5637f292447433c8dc643c890765d21/1080p/mp4/file.mp4"
            muted
            playsinline
            preload="auto"
          ></video>

          <div class="lh-overlay"></div>

          <div class="lh-content">
            <div class="lh-eyebrow">3D Designs for Landscape Contractors</div>
            <h1>More Designs. More Clarity. Better Close Rates.</h1>
            <p>
              Use 3D designs before the job is sold — so homeowners can see the full vision,
              understand the scope, and move forward with more confidence.
            </p>

            <div class="lh-actions">
              <a href="/3d-landscape-designs-for-contractors#quote" class="lh-btn lh-btn-primary">Get a Project Quote</a>
              <a href="/3d-landscape-designs-for-contractors#examples" class="lh-btn lh-btn-secondary">View Design Examples</a>
            </div>

            <div class="lh-note">
              3D designs start at $300. 2D plans and social content are available as add-ons.
            </div>
          </div>
        </div>

        <div class="lh-scroll-pill lh-pill-1">Start with the idea.</div>
        <div class="lh-scroll-pill lh-pill-2">Build the vision.</div>
        <div class="lh-scroll-pill lh-pill-3">Present the full plan.</div>
      </section>
    `;
  }
}

if (typeof window !== "undefined" && "customElements" in window) {
  if (!customElements.get("left-hooks-scroll-hero")) {
    customElements.define("left-hooks-scroll-hero", LeftHooksScrollHero);
  }
}
