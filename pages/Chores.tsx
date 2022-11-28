import { observer } from "mobx-react-lite";
import Link from "next/link";
import { PinpaperFilled } from "react-swm-icon-pack";

const Chores = () => {
  return (
    <Link href='/payments'>
      <PinpaperFilled size='100'></PinpaperFilled>
    </Link>
  );
};

export default observer(Chores);
