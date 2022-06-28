import React, { FC, useEffect } from "react";
import Loading from "@/Loading";
import { connect } from "react-redux";
import { getMain } from "redux/selectors";
import { IAppState, IMainState } from "redux/types";
import { useRouter } from "next/router";

interface IStateProps {
  main: IMainState;
}

type IProps = IStateProps;

const Coordinates: FC<IProps> = ({ main: { mapCenter, zoom } }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(`/${mapCenter.lat},${mapCenter.lng}/${zoom}`);
  }, [mapCenter, zoom, router]);

  return <Loading />;
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  main: getMain(state),
});

export default connect(mapStateToProps)(Coordinates);
