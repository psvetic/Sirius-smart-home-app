<!-- Komponenta naslovne stranice -->
<!-- Sastoji se od općih informacija o Sirius aplikaciji, te gumba koji vodi na formu za login -->
<template>
  <div class="q-pa-md row items-start q-gutter-md justify-center">

    <div class="q-pa-md row items-start q-gutter-md justify-center">

      <q-card class="my-card col-sm-4" flat bordered>
        <q-card-section horizontal>
          <q-img
            src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/tiny-houses-1579284305.png"
            class="col-4"
          />

          <q-card-section>
            <h5>Sirius Smart Home System</h5>
            <p>Your new favourite.</p>
          </q-card-section>
        </q-card-section>
      </q-card>

      <q-card class="my-card col-sm-6" flat bordered>
        <q-card-section horizontal>
          <q-card-section class="col-6">
            <div>
              <p>Why Sirius?</p>
              <ul>
                <li>It is fully customizable.</li>
                <li>You have all your devices in one place.</li>
                <li>Remote access.</li>
                <li>Easy to use.</li>
              </ul>
            </div>
          </q-card-section>

          <q-separator vertical />

          <q-card-section>
            <p>What do people say about Sirius? See on our Reviews page. We listen to you.<br><br>Contact us on our psvetic@uniri.hr mail and we will get back to you as soon as possible.</p>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>

    <div class="row">
      <q-card class="my-card col">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://image.shutterstock.com/image-vector/internet-things-glyph-icon-silhouette-260nw-1172566369.jpg">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Sirius</q-item-label>
            <q-item-label caption>Internet of Things</q-item-label>
          </q-item-section>
        </q-item>

        <q-img
          src="https://news.mit.edu/sites/default/files/styles/news_article__image_gallery/public/images/202011/MIT-Tiny-AI-01_0.jpg"
          width="300px"
        />
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage'
}
</script>

<style>
.img-position {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  max-width: 500px;
  padding-top: 50px;
}
.my-card
{
  width: 100%;
  max-width: 350px
}
</style>
