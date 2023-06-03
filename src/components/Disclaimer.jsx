import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Disclaimer({
  pendingRoute,
  setAgreed,
  setVisible,
  visible,
}) {
  const navigate = useNavigate();

  const agree = () => {
    navigate(pendingRoute);
    setAgreed(true);
    setVisible(false);
    localStorage.setItem('disclaimer', 'agreed');
  };

  const decline = () => {
    setVisible(false);
  };

  return (
    <div className={visible ? 'disclaimer visible' : 'disclaimer hidden'}>
      <h2>Disclaimer</h2>
      <div className="disclaimer-content">
        To access this section of Cheddit (the &quot;website&quot;), you
        understand and agree to the following:
        <ol>
          <li>
            Although boards on Cheddit are generally considered &quot;work
            safe,&quot; the content of this website is for mature audiences only
            and may not be suitable for minors. If you are a minor or it is
            illegal for you to access mature images and language, do not
            proceed.
          </li>
          <li>
            This website is presented to you AS IS, with no warranty, express or
            implied. By clicking &quot;I Agree,&quot; you agree not to hold
            Cheddit responsible for any damages from your use of the website,
            and you understand that the content posted is not owned or generated
            by Cheddit, but rather by Cheddit&apos;s users.
          </li>
          <li>
            As a condition of using this website, you agree to comply with the
            {' '}
            <Link to="/rules">&quot;Rules&quot;</Link>
            {' '}
            of Cheddit, which are
            also linked on the home page. Please read the Rules carefully,
            because they are important.
          </li>
        </ol>
        <span className="disclaimer-buttons">
          <button onClick={agree} type="button">
            I Agree
          </button>
          <button onClick={decline} type="button">
            Decline
          </button>
        </span>
      </div>
    </div>
  );
}
