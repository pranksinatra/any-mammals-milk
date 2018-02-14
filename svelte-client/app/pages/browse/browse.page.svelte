<Nav page={{page}}></Nav>

<main>

  <h1>Browse &amp; Search Mammals</h1>

  <br><br>

  <p>We're working on this feature. <a href="/">Keep swiping!</a></p>

  <br><br><br><br><br><br><br>

</main>

<Footer></Footer>


<style>
  p {
    text-align: center;
  }
</style>

<script>
  import roadtrip from 'roadtrip';
  import Nav from '../../components/Nav';
  import Footer from '../../components/Footer';

  export default {
    components: {
      Nav, Footer
    },
    data() {
      return {
        users: [
          {id: 1},
          {id: 2},
          {id: 3},
          {id: 4},
          {id: 5}
        ]
      }
    },
    methods: {
      goto(path) {
        roadtrip.goto(path);
      }
    }
  }
</script>
