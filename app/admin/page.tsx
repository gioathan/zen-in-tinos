"use client";

import { Card, Col, Row, Statistic, Spin } from "antd";
import { HomeOutlined, AppstoreOutlined, StarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";

interface DashboardStats {
  totalHouses: number;
  publishedHouses: number;
  totalServices: number;
  totalAmenities: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHouses: 0,
    publishedHouses: 0,
    totalServices: 0,
    totalAmenities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total houses
        const { count: housesCount } = await supabaseClient
          .from("houses")
          .select("*", { count: "exact", head: true });

        // Get published houses
        const { count: publishedCount } = await supabaseClient
          .from("houses")
          .select("*", { count: "exact", head: true })
          .eq("is_published", true);

        // Get total services
        const { count: servicesCount } = await supabaseClient
          .from("services")
          .select("*", { count: "exact", head: true });

        // Get total amenities
        const { count: amenitiesCount } = await supabaseClient
          .from("amenities")
          .select("*", { count: "exact", head: true });

        setStats({
          totalHouses: housesCount || 0,
          publishedHouses: publishedCount || 0,
          totalServices: servicesCount || 0,
          totalAmenities: amenitiesCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px", color: "#ededed" }}>Dashboard</h1>
      
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}
            bodyStyle={{ color: "#ededed" }}
          >
            <Statistic 
              title={<span style={{ color: "#888" }}>Total Houses</span>}
              value={stats.totalHouses}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#3b82f6" }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}
            bodyStyle={{ color: "#ededed" }}
          >
            <Statistic 
              title={<span style={{ color: "#888" }}>Published Houses</span>}
              value={stats.publishedHouses}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#10b981" }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}
            bodyStyle={{ color: "#ededed" }}
          >
            <Statistic 
              title={<span style={{ color: "#888" }}>Services</span>}
              value={stats.totalServices}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#f59e0b" }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ background: "#1a1a1a", borderColor: "#2a2a2a" }}
            bodyStyle={{ color: "#ededed" }}
          >
            <Statistic 
              title={<span style={{ color: "#888" }}>Amenities</span>}
              value={stats.totalAmenities}
              prefix={<StarOutlined />}
              valueStyle={{ color: "#8b5cf6" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card 
            title={<span style={{ color: "#ededed" }}>Quick Actions</span>}
            style={{ 
              textAlign: 'center',
              background: "#1a1a1a", 
              borderColor: "#2a2a2a"
            }}
            bodyStyle={{ padding: "40px" }}
          >
            <p style={{ fontSize: '16px', color: '#888', marginBottom: 0 }}>
              Welcome to Zen in Tinos admin dashboard. Use the menu on the left to manage your properties, services, and settings.
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}