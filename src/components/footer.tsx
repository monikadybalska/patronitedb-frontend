export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-nav">
          <div>
            <h3>About</h3>
            <ul className="footer-links">
              <li>GitHub</li>
              <li>FAQ & Help</li>
              <li>Contribute</li>
            </ul>
          </div>
          <div>
            <h3>Database</h3>
            <ul className="footer-links">
              <li>Authors</li>
              <li>Categories</li>
              <li>Goals</li>
            </ul>
          </div>
          <div>
            <h3>Charts</h3>
            <ul className="footer-links">
              <li>Most subscribed authors</li>
              <li>Trending authors</li>
              <li>Highest-earning authors</li>
              <li>Most popular categories</li>
            </ul>
          </div>
        </div>
        <p className="disclaimer">
          PatroniteDB is a hobby project and is not affiliated with Patronite.
          All times on the site are UTC. Patronite logo is a trademark of
          Patronite. All other trademarks are property of their respective
          owners.
        </p>
        <p className="copyright">© PatroniteDB</p>
      </div>
    </footer>
  );
}
