import React, { FC, useEffect } from "react";
import { IAppState, IMainState } from "redux/types";
import { getMain } from "redux/selectors";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Loading from "@/Loading";

interface IStateProps {
  main: IMainState;
}

type IProps = IStateProps;

const PreRoute: FC<IProps> = ({ main: { mapCenter, zoom } }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/${mapCenter.lat},${mapCenter.lng}/${zoom}`);
  }, [mapCenter, zoom, router]);

  return <Loading />;
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  main: getMain(state),
});

export default connect(mapStateToProps)(PreRoute);
