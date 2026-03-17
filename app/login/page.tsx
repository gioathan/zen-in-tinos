"use client";

import { supabaseClient } from "@/lib/supabase";
import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    console.log("Starting Google login...");
    
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/admin",
      },
    });

    console.log("OAuth response:", { data, error });

    if (error) {
      console.error("Login error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      background: "#0a0a0a"
    }}>
      <Button 
        type="primary" 
        icon={<GoogleOutlined />} 
        size="large"
        onClick={handleGoogleLogin}
      >
        Sign in with Google
      </Button>
    </div>
  );
}