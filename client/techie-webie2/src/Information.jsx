import { useState } from "react";

function Information() {
  const [news, setNews] = useState([]);

  return (
    <div className="information">
      <h2>Notices</h2>
      <p>
        <b>ATTENTION NEW MEMBERS :</b> Please refrain from posting inaccurate
        information about the events.
      </p>
      <p>
        <b>Votes are in :</b> Technologies de Web (LU3IN017) officially declared
        the best class ever !
      </p>
      <p> New event date to be revealed soon !</p>
      <p>
        <b>ATTENTION :</b> user christinemachere is officially banned. False
        accusations done towards our organization will therefore not be
        tolerated.
      </p>
      <p>
        <b>Fact of the day :</b> We are always right. Listen to your
        administrateurs.
      </p>
      <p>
        {" "}
        <b>THEY ARE COMING. NO TIME LEFT. RUN.</b>
      </p>
      <p>Ḥ̷̛͖͈̤͍̹̜̗̫͖̣̜̯̳̟̄̇͐͑̿̀̈̓̈́̉Ẹ̷̡̨̬̙͖̥͕̪͋͋̍̎̐̀́Ļ̴̪̗͓͖̙̠̫͙͚̞̪̰̑̀͐̆͂̇P̵̱̻̜̀̾͆̆̑̚̕͠ ̷̺̻̬͕̻͕̼̠̍̅̈̄̄͑͐̔̚ͅḦ̵̪̖͎̝̼̳̱̽̍̿̀E̵̼̻͍̘̤̱͚͉̾̽̈́̔Ĺ̴̡̛͚̱͈͖̦̫̹͋̅̏̏̃̔̎͗͆̽̆͘P̵̡̡̜͙̞̬̲̰̲͈̪̬̺͛͜͜͜͝ ̵̡̛̜͙͚̈́̿̕H̴̬̹͚̜̝͎͎̥̜̠̞͛̂͋̍̉͜Ȩ̵̨̲̗̳̰̦̟̳͉̪͍̝̜̓̽͜L̸̖̣͙͔̻̘̖̘̒̍̓̇͌̏͂̓͜P̵̡̧̢̨͔̞̳̙̖͇̈́̑̆̀</p>
      <p> </p>
      <p> I had no choice. They took everything from me.</p>
    </div>
  );
}

export default Information;
