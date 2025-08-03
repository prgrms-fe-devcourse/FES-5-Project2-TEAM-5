import style from './style.module.css';

const About = () => {
  return (
    <div className={style.container}>
      <video
        className={style.backgroundVideo}
        src="https://videos.pexels.com/video-files/856175/856175-uhd_2560_1440_25fps.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* 그라데이션 오버레이 */}
      <div className={style.overlay}></div>

      <section className={style.bannerSection}>
        <div className={style.heroContent}>
          <h1 className={style.mainTitle}>
            Cultivate Your Inner Garden
            <span className={style.brandName}>with Seediary</span>
          </h1>
          <p className={style.subtitle}>오늘 당신의 마음에 씨앗을 심어보세요</p>
          <p className={style.description}>매일 쓰는 일기가 자라나는 나만의 정원이 되는 곳</p>
          {/* <button className={style.ctaButton}>회원가입</button> */}
        </div>
      </section>

      <section className={style.keyFeatureSection}>
        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>Key Features</h2>
          <p className={style.sectionSubtitle}>단순한 일기장이 아닌, 멘탈 케어 플렛폼</p>
        </div>

        <div className={style.featureGrid}>
          <div className={style.featureCard}>
            <h3 className={style.featureTitle}>📔 감정 일기</h3>
            <p className={style.featureDescription}>
              느낀 감정을 선택하고 오늘의 이야기를 자유롭게 적어보세요. 감정은 마음에 씨앗처럼 심겨
              일기를 쓰며 자라고, 쌓인 감정은 통계로 나만의 마음 흐름을 보여줍니다.
            </p>
          </div>
          <div className={style.featureCard}>
            <h3 className={style.featureTitle}>🌼 AI 친구 몰리</h3>
            <p className={style.featureDescription}>
              따뜻한 AI 챗봇 몰리와 대화하며, 나만을 위한 세심한 조언과 진심 어린 위로를
              경험해보세요. 몰리는 당신의 감정을 이해하고, 언제나 곁에서 따뜻하게 응원해 줍니다.
            </p>
          </div>
          <div className={style.featureCard}>
            <h3 className={style.featureTitle}>🧐 감정 분석</h3>
            <p className={style.featureDescription}>
              상세한 감정 선택과 이유 작성 후, AI가 분석한 리포트를 받아보세요. 이를 통해 내 마음의
              흐름을 깊이 이해하고, 스스로에 대한 새로운 통찰을 얻을 수 있습니다.
            </p>
          </div>
          <div className={style.featureCard}>
            <h3 className={style.featureTitle}>😃 커뮤니티</h3>
            <p className={style.featureDescription}>
              커뮤니티는 다른 사람들의 일기를 읽고, 나의 이야기를 공유하는 공간입니다. 비슷한 마음을
              가진 사람들과 공감하며 따뜻한 연결을 만들어 보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={style.footer}>
        <div className={style.footerContent}>
          <div className={style.footerMain}>
            <div className={style.footerBrand}>
              <h3 className={style.footerTitle}>Seediary</h3>
              <p className={style.footerTagline}>당신만의 감정 정원을 가꿔보세요</p>
            </div>

            <div className={style.footerInfo}>
              <div className={style.footerSection}>
                <h4 className={style.footerSectionTitle}>Made by</h4>
                <p className={style.footerText}>Team Blanket Crew</p>
              </div>

              <div className={style.footerSection}>
                <h4 className={style.footerSectionTitle}>Connect</h4>
                <div className={style.footerLinks}>
                  <a
                    href="https://github.com/prgrms-fe-devcourse/FES-5-Project2-TEAM-5"
                    className={style.footerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className={style.githubIcon} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={style.footerBottom}>
            <div className={style.footerBottomContent}>
              <p className={style.footerCopyright}>© 2025 Seediary. All rights reserved.</p>
              <div className={style.footerMeta}>
                <span className={style.footerVersion}>v1.0.0</span>
                <span className={style.footerDot}>•</span>
                <span className={style.footerUpdate}>Last updated: Jan 2025</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
