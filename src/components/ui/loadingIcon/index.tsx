// // TODO: Fix this component

import loadingIcon from '@/icons/loading.svg';
import classes from './loadingIcon.module.css';

//React.ComponentPropsWithRef<'img'>
export default function LoadingIcon(props: any) {
    return (
        <img src={ loadingIcon } alt={ 'Loading...' } { ...props }
             className={ `${classes.loadingIcon} ${props.className || ''}` }/>
    );
}
