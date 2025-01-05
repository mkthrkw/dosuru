import { LoginForm } from '@/app/_features/auth/components/LoginForm';

export default function Page() {

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left text-base-content/60">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">some text.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}