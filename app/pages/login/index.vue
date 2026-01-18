<template>
  <div class="login_page page">
    <div class="container">
      <!-- <h1>{{ $t('login_page.title') }}</h1> -->
      <div class="image">
        <img src="../../assets/images/logo.png" alt="image" loading="lazy" />
      </div>
      <VeeForm
        :validation-schema="loginSchema"
        @submit="handleSubmit"
        class="login_form"
      >
        <CustomField
          name="email"
          type="email"
          :label="$t('login_page.email')"
          :placeholder="$t('login_page.emailPlaceholder')"
        />

        <CustomField
          name="password"
          type="password"
          :label="$t('login_page.password')"
          :placeholder="$t('login_page.passwordPlaceholder')"
        />
        <button class="main-btn">{{ $t("login_page.submit_button") }}</button>
      </VeeForm>
      <LanguageSwitch />
    </div>
  </div>
</template>

<script setup>
// define loginSchema
const loginSchema = useLoginSchema();

// DEFINE API METHODS
  const {
    submitMethod
  } = useApiMethods()

// DEFINE PAGE META
definePageMeta({
  layout: false,
});


const handleSubmit = (values) => {
  submitMethod('login' , false , values , 'POST' , '/' )
};
</script>

<style lang="scss" scoped>
.login_page {
  padding: 0;
  background: linear-gradient(84deg, #007593 3.25%, #044d60 96.85%);
  color: #fff;
  position: relative;
  overflow: hidden;
  /* Animated gradient background */
  background-size: 200% 200%;
  animation: gradientShift 8s ease infinite;

  /* Subtle floating particles effect */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(255, 255, 255, 0.1) 2%,
        transparent 5%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 255, 255, 0.1) 2%,
        transparent 5%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(255, 255, 255, 0.05) 3%,
        transparent 8%
      );
    // animation: floatParticles 15s ease-in-out infinite;
    pointer-events: none;
  }

  .container {
    // animation: slideUpFadeIn 1s ease-out 0.3s both;
    position: relative;
    z-index: 2;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;

    h1 {
      font-size: 40px;
      font-weight: 700;
      animation: textGlow 3s ease-in-out infinite alternate;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }

    .image {
      max-width: 300px;
      margin: 0 auto 20px;
      animation: bounceIn 1s ease-out 0.5s both,
        float 6s ease-in-out 1.5s infinite;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
    }

    .login_form {
      margin-block-start: 50px;
      max-width: 800px;
      width: 100%;
      margin: 50px auto 0;
      background: #fff;
      padding: 20px 20px;
      border-radius: 20px;
      color: $mainColor;
      animation: formSlideIn 0.8s ease-out 0.8s both;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      transform-style: preserve-3d;
      perspective: 1000px;

      /* Form elements animations */
      .form-group {
        animation: fadeInUp 0.6s ease-out 1s both;

        &:nth-child(2) {
          animation-delay: 1.2s;
        }
      }

      .main-btn {
        max-width: 100%;
        width: 100%;
        margin-block-start: 20px;
        animation: fadeInUp 0.6s ease-out 1.4s both,
          pulse 2s ease-in-out 2s infinite;
        background: linear-gradient(45deg, #007593, #044d60);
        border: none;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s ease;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 117, 147, 0.4);

          &::before {
            left: 100%;
          }
        }

        &:active {
          transform: translateY(0);
        }
      }

      /* Input field animations */
      input {
        transition: all 0.3s ease;
        border: 2px solid #e0e0e0;
        padding: 8px !important;

        &:focus {
          border-color: #007593;
          box-shadow: 0 0 0 3px rgba(0, 117, 147, 0.1);
          transform: scale(1.02);
        }

        &:hover {
          border-color: #007593;
        }
      }
    }
  }
}

/* Keyframe Animations */
@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes slideUpFadeIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  from {
    opacity: 0;
    transform: scale(0.3) translateY(-50px);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(1deg);
  }
}

@keyframes formSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) rotateX(10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 5px 15px rgba(0, 117, 147, 0.4);
  }
  50% {
    box-shadow: 0 8px 25px rgba(0, 117, 147, 0.6);
  }
}

@keyframes textGlow {
  from {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
  to {
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.6),
      0 0 40px rgba(255, 255, 255, 0.4);
  }
}

@keyframes floatParticles {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-15px);
  }
  75% {
    transform: translateY(15px) translateX(5px);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .login_page {
    .container {
      h1 {
        font-size: 32px;
      }

      .image {
        max-width: 250px;
      }

      .login_form {
        margin: 30px 20px 0;
        padding: 20px 15px;
      }
    }
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .login_page {
    animation: none;

    &::before {
      animation: none;
    }

    .container,
    .image,
    .login_form,
    .form-group,
    .main-btn {
      animation: none !important;
    }
  }
}
</style>
