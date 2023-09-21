import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { ReactSVG } from 'react-svg';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { StaticImageData } from 'next/image';

import ActionPopup from '../../ui/modals/actionPopup';
import LoginForm from './form';

import { UserContext } from '@/contexts/userContext';

import { getBackendUrl } from '@/helpers/url';

import google from '@/icons/providers/google.svg';
import github from '@/icons/providers/github.svg';

import classes from './styles.module.css';
import TextInput from '@/components/ui/input/textInput';
import { AUTH_SERVER_URL, SERVER_URL } from '@/settings';
import Auth from '@/helpers/auth';
import api from '@/helpers/api';
import { formToJSON } from 'axios';

function Separator() {
    return (
        <div className={ classes.separatorContainer }>
            <span className={ classes.sepLine } />
            <span className={ classes.sepOr }>OR</span>
            <span className={ classes.sepLine } />
        </div>
    );
}

function OAuthLink(props: {
    icon: StaticImageData;
    provider: string;
    mode: 'signup' | 'login';
    onClick?: (url: string) => void;
    className?: string;
}) {
    const url = getBackendUrl(`/api/auth/${props.provider.toLowerCase()}`);

    return (
        <Link
            href={ url }
            onClick={ (e) => {
                e.preventDefault();
                props.onClick?.(url);
            } }
            className={ `${classes.oAuthBtn} ${
                props.className ? props.className : ''
            }` }
        >
            <ReactSVG src={ props.icon.src } />

            <span>
                { props.mode === 'login' ? 'Sign in' : 'Sign up' } with{ ' ' }
                { props.provider }
            </span>
        </Link>
    );
}

export default function Login(props: {
    mode: 'login' | 'signup';
    onClose: () => void;
}) {
    const router = useRouter();

    const isVerifying = router.query.status === 'verifying'

    const { user, refreshUser, getUser } = useContext(UserContext);

    const [mode, updateMode] = useState((router.query?.mode as typeof props.mode) ?? props.mode);
    const [isOtp, setIsOtp] = useState(false)
    const [qr, setQr] = useState<string|null>(null)
    const [provider, setProvider] = useState<'google'|'github'|null>(null)

    const userRef = useRef<User|null>(null)
    
    const redirect = useCallback(
        function redirect() {
            const {code} = router.query;
            if (code) router.push(`/authorize?code=${code}`).then();
            if (router.asPath !== router.pathname) {
                // router.replace(`/marketplace`).then();
            }
 else router.replace(router.asPath).then();
        },
        [router]
    );

    const isLogin = mode === 'login';

    const curPopup = useRef<Window | null>(null);

    useEffect(() => {
        if (user) {
            redirect();
        }
    }, [user]);

    const switchToOTP = (val:boolean) => {
        setIsOtp(true)
    }

    const openDash = () => {
        router.push('/marketplace')
    } 

    const onOTPProviderAuth = async (form:HTMLFormElement) => {
        const formData = formToJSON(form) as {otp:string}
        const {data} = await api.post<{success:boolean}>('/api/auth/2fa',{email:userRef.current?.email,otp:formData.otp})
        console.log(data)
        if(data.success){
            refreshUser()
            openDash()
        }
    }

    function oAuthLogin(path: string) {
        
        // Don't open too many auth windows.
        if (curPopup.current) curPopup.current.close();
        console.log(path)
        const urlSegments = path.split('/')
        const authProvider = urlSegments[urlSegments.length-1]
        setProvider(authProvider as typeof provider)

        const popup = window.open(path,"_blank");

        if (popup) {
            curPopup.current = popup;

            window.addEventListener('message', async function goToDashboard(e) {
                
                if([AUTH_SERVER_URL,SERVER_URL?.slice(0,-1)].includes(e.origin)){
                    if (e.data.success) {
                        console.log('DDDD',e.data)
                        popup.close();
                        const userData = await getUser()
                        userRef.current = userData
                        // setProvider(userData.p)
                        if(userData){
                            const res = await Auth.generateOTP(userData.email)
                            if(res?.success){
                                setQr(res.data)
                            }
                        }

                        // TODO: Only call this after 2fa 
                        setIsOtp(true)
                        // refreshUser();
                        // redirect();
                    } else if (!e.data.success) {
                        console.log(e)
                        !popup.closed && popup?.close();
                        throw new Error(e.data.message);
                    }}
                // }
            });
        }
    }

    if(isVerifying)return<ActionPopup
    blurBg={ true }
    modalClassName={ classes.modal }
    popupTitle={ 'Auth Verification' }
    onClose={ props.onClose }
    >
        <div className={`${classes.verification}`}>
            <TextInput label='Please enter your OTP' />
        </div>
    </ActionPopup>

    return (
        <ActionPopup
            blurBg={ true }
            modalClassName={ classes.modal }
            popupTitle={ isOtp? 'Verification': (isLogin ? 'Sign in' : 'Sign Up') }
            onClose={ props.onClose }
        >
            <section className={ classes.modalContent }>
                {
                    !isOtp && <>
                        <div className={ classes.oAuthContainer }>
                            <OAuthLink
                                icon={ google }
                                provider="Google"
                                mode={ mode }
                                onClick={ oAuthLogin }
                            />

                            <OAuthLink
                                icon={ github }
                                provider="GitHub"
                                mode={ mode }
                                onClick={ oAuthLogin }
                                className={ classes.githubIcon }
                            />
                        </div>

                        <Separator />
                    </>
                }
                <LoginForm 
                    mode={ mode } 
                    onSubmit={provider?onOTPProviderAuth:undefined} 
                    qr={qr} 
                    switchToOTP={switchToOTP} 
                    isOTP={isOtp} 
                    redirect={ openDash } 
                />

                { isLogin ? (
                    <p className={ classes.changeType }>
                        Don&apos;t have an account?
                        <button
                            className={ classes.changeTypeButton }
                            onClick={ () => updateMode('signup') }
                        >
                            Sign up
                        </button>
                        instead.
                    </p>
                ) : (!isOtp&&<>
                    {
                        <p className={ classes.changeType }>
                            Already have an account?
                            <button
                                className={ classes.changeTypeButton }
                                onClick={ () => updateMode('login') }
                            >
                                Sign in
                            </button>
                            instead.
                        </p>
                    }
                    </>
                ) }

                <p className={ classes.footer }>
                    By signing in you agree to our{ ' ' }
                    <Link href="/terms">Terms & Conditions.</Link>
                </p>
            </section>
        </ActionPopup>
    );
}
