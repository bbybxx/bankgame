import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ShoppingCart,
  Home as HomeIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Smile,
  Frown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useGameStore } from '../src/store/gameStore';
import { triggerHaptic } from '../src/utils/haptics';
import { investmentCatalog, buyInvestment, InvestmentCatalogItem } from '../src/engine/gameLogic';
import { showToast } from '../src/components/ToastManager';
import { Colors } from '../src/theme/colors';
import { Typography } from '../src/theme/typography';
import { Spacing } from '../src/theme/spacing';
import { BorderRadius } from '../src/theme/spacing';

type Tab = 'portfolio' | 'market';

export default function InvestmentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<InvestmentCatalogItem | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);
  const [shareCount, setShareCount] = useState('1');
  const playerStats = useGameStore((s) => s.playerStats);
  const buyInvestmentAction = useGameStore((s) => s.buyInvestmentAction);
  const sellInvestmentAction = useGameStore((s) => s.sellInvestmentAction);
  const investments = playerStats.investments || [];
  const portfolioValue = playerStats.investmentPortfolioValue || 0;
  const availableFunds = playerStats.balanceDebit + playerStats.balanceVirtual;

  // Calculate total cost
  const totalCost = useMemo(() => {
    if (!selectedAsset) return 0;
    const count = parseInt(shareCount) || 0;
    return selectedAsset.sharePrice * count;
  }, [selectedAsset, shareCount]);

  // Calculate sell proceeds and P&L
  const { proceeds, gainLoss, gainLossPercent } = useMemo(() => {
    if (!selectedInvestment) return { proceeds: 0, gainLoss: 0, gainLossPercent: 0 };
    const count = parseInt(shareCount) || 0;
    const saleProceeds = selectedInvestment.sharePrice * count;
    const originalCost = selectedInvestment.purchasePrice * count;
    const gain = saleProceeds - originalCost;
    const gainPercent = originalCost > 0 ? (gain / originalCost) * 100 : 0;
    return { proceeds: saleProceeds, gainLoss: gain, gainLossPercent: gainPercent };
  }, [selectedInvestment, shareCount]);

  const canAfford = totalCost <= availableFunds;
  const shareCountNum = parseInt(shareCount) || 0;

  // Calculate total P&L
  const totalPL = useMemo(() => {
    return investments.reduce((sum, inv) => {
      const currentValue = inv.sharePrice * inv.sharesOwned;
      const originalCost = inv.purchasePrice * inv.sharesOwned;
      return sum + (currentValue - originalCost);
    }, 0);
  }, [investments]);

  const totalPLPercent = useMemo(() => {
    const totalCost = investments.reduce((sum, inv) => 
      sum + (inv.purchasePrice * inv.sharesOwned), 0
    );
    return totalCost > 0 ? (totalPL / totalCost) * 100 : 0;
  }, [investments, totalPL]);

  const handleTabChange = async (tab: Tab) => {
    await triggerHaptic('impactLight');
    setActiveTab(tab);
  };

  const openBuyModal = async (asset: InvestmentCatalogItem) => {
    await triggerHaptic('impactMedium');
    setSelectedAsset(asset);
    setShareCount('1');
    setBuyModalVisible(true);
  };

  const closeBuyModal = async () => {
    await triggerHaptic('impactLight');
    setBuyModalVisible(false);
    setSelectedAsset(null);
    setShareCount('1');
  };

  const handleBuyConfirm = async () => {
    if (!selectedAsset || shareCountNum <= 0) {
      await triggerHaptic('notificationError');
      showToast('Invalid share count', 'error');
      return;
    }

    if (!canAfford) {
      await triggerHaptic('notificationError');
      showToast(`Insufficient funds. Need $${totalCost.toFixed(2)}`, 'error');
      return;
    }

    await triggerHaptic('notificationSuccess');
    const result = buyInvestmentAction(selectedAsset, shareCountNum);
    
    if (result.success) {
      showToast(`✓ Bought ${shareCountNum} shares of ${selectedAsset.symbol}`, 'success');
      closeBuyModal();
      setActiveTab('portfolio');
    } else {
      await triggerHaptic('notificationError');
      showToast(result.message, 'error');
    }
  };

  const openSellModal = async (investment: any) => {
    await triggerHaptic('impactMedium');
    setSelectedInvestment(investment);
    setShareCount('1');
    setSellModalVisible(true);
  };

  const closeSellModal = async () => {
    await triggerHaptic('impactLight');
    setSellModalVisible(false);
    setSelectedInvestment(null);
    setShareCount('1');
  };

  const handleSellConfirm = async () => {
    if (!selectedInvestment || shareCountNum <= 0) {
      await triggerHaptic('notificationError');
      showToast('Invalid share count', 'error');
      return;
    }

    if (shareCountNum > selectedInvestment.sharesOwned) {
      await triggerHaptic('notificationError');
      showToast('Cannot sell more shares than owned', 'error');
      return;
    }

    await triggerHaptic('notificationSuccess');
    const result = sellInvestmentAction(selectedInvestment, shareCountNum);
    
    if (result.success) {
      const gainText = gainLoss >= 0 ? `+$${gainLoss.toFixed(2)}` : `-$${Math.abs(gainLoss).toFixed(2)}`;
      showToast(`✓ Sold ${shareCountNum} shares • ${gainText}`, gainLoss >= 0 ? 'success' : 'error');
      closeSellModal();
    } else {
      await triggerHaptic('notificationError');
      showToast(result.message, 'error');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.back();
            }}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Investments</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Portfolio Value Hero Card */}
        <LinearGradient
          colors={['#1A1A1A', '#0F0F0F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroHeader}>
            <Text style={styles.heroLabel}>PORTFOLIO VALUE</Text>
            <View style={[styles.trendBadge, totalPL >= 0 ? styles.trendPositive : styles.trendNegative]}>
              {totalPL >= 0 ? (
                <TrendingUp size={16} color={Colors.wealth.profit} />
              ) : (
                <TrendingDown size={16} color={Colors.wealth.loss} />
              )}
            </View>
          </View>
          <Text style={styles.heroAmount}>
            ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.heroPL}>
            <Text style={[styles.heroPLText, { color: totalPL >= 0 ? Colors.wealth.profit : Colors.wealth.loss }]}>
              {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text style={[styles.heroPLPercent, { color: totalPL >= 0 ? Colors.wealth.profit : Colors.wealth.loss }]}>
              ({totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)
            </Text>
          </View>
        </LinearGradient>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tab, activeTab === 'portfolio' && styles.tabActive]}
            onPress={() => handleTabChange('portfolio')}
          >
            <PieChart 
              size={20} 
              color={activeTab === 'portfolio' ? Colors.gold.primary : Colors.text.secondary} 
            />
            <Text style={[styles.tabText, activeTab === 'portfolio' && styles.tabTextActive]}>
              Portfolio
            </Text>
            {investments.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{investments.length}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'market' && styles.tabActive]}
            onPress={() => handleTabChange('market')}
          >
            <ShoppingCart 
              size={20} 
              color={activeTab === 'market' ? Colors.gold.primary : Colors.text.secondary} 
            />
            <Text style={[styles.tabText, activeTab === 'market' && styles.tabTextActive]}>
              Market
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'portfolio' ? (
            investments.length === 0 ? (
              <View style={styles.emptyState}>
                <PieChart size={64} color={Colors.text.tertiary} />
                <Text style={styles.emptyTitle}>No Investments Yet</Text>
                <Text style={styles.emptyText}>
                  Start building your portfolio by purchasing assets from the Market tab
                </Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => handleTabChange('market')}
                >
                  <Text style={styles.emptyButtonText}>Browse Market</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.portfolioContainer}>
                {investments.map((investment) => {
                  const currentValue = investment.sharePrice * investment.sharesOwned;
                  const originalCost = investment.purchasePrice * investment.sharesOwned;
                  const pl = currentValue - originalCost;
                  const plPercent = (pl / originalCost) * 100;

                  return (
                    <View key={investment.id} style={styles.investmentCard}>
                      <View style={styles.investmentHeader}>
                        <View style={styles.investmentTitleRow}>
                          <Text style={styles.investmentSymbol}>{investment.symbol}</Text>
                          <View style={[styles.typeBadge, { backgroundColor: getTypeBadgeColor(investment.type) }]}>
                            <Text style={styles.typeBadgeText}>{investment.type.toUpperCase()}</Text>
                          </View>
                        </View>
                        <Text style={styles.investmentName}>{investment.name}</Text>
                      </View>

                      <View style={styles.investmentStats}>
                        <View style={styles.statRow}>
                          <Text style={styles.statLabel}>Shares</Text>
                          <Text style={styles.statValue}>{investment.sharesOwned.toLocaleString()}</Text>
                        </View>
                        <View style={styles.statRow}>
                          <Text style={styles.statLabel}>Current Price</Text>
                          <Text style={styles.statValue}>${investment.sharePrice.toFixed(2)}</Text>
                        </View>
                        <View style={styles.statRow}>
                          <Text style={styles.statLabel}>Total Value</Text>
                          <Text style={[styles.statValue, styles.statValueBold]}>
                            ${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.plContainer}>
                        <View style={styles.plRow}>
                          <Text style={styles.plLabel}>Profit/Loss</Text>
                          <View style={styles.plValues}>
                            <Text style={[styles.plAmount, { color: pl >= 0 ? Colors.wealth.profit : Colors.wealth.loss }]}>
                              {pl >= 0 ? '+' : ''}${Math.abs(pl).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </Text>
                            <Text style={[styles.plPercent, { color: pl >= 0 ? Colors.wealth.profit : Colors.wealth.loss }]}>
                              {plPercent >= 0 ? '+' : ''}{plPercent.toFixed(2)}%
                            </Text>
                          </View>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.sellButton}
                        onPress={() => openSellModal(investment)}
                      >
                        <Text style={styles.sellButtonText}>Sell</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )
          ) : (
            <View style={styles.marketContainer}>
              {investmentCatalog.map((item) => {
                const owned = investments.find(inv => inv.symbol === item.symbol);
                
                return (
                  <View key={item.symbol} style={styles.marketCard}>
                    <View style={styles.marketHeader}>
                      <View style={styles.marketTitleRow}>
                        <Text style={styles.marketSymbol}>{item.symbol}</Text>
                        <View style={[styles.riskBadge, { backgroundColor: getRiskBadgeColor(item.riskLevel) }]}>
                          <Text style={styles.riskBadgeText}>{item.riskLevel.toUpperCase()}</Text>
                        </View>
                      </View>
                      <Text style={styles.marketName}>{item.name}</Text>
                      <Text style={styles.marketDescription}>{item.description}</Text>
                    </View>

                    <View style={styles.marketStats}>
                      <View style={styles.marketStatItem}>
                        <Text style={styles.marketStatLabel}>Price</Text>
                        <Text style={styles.marketStatValue}>${item.sharePrice.toFixed(2)}</Text>
                      </View>
                      <View style={styles.marketStatItem}>
                        <Text style={styles.marketStatLabel}>Type</Text>
                        <Text style={styles.marketStatValue}>{item.type.toUpperCase()}</Text>
                      </View>
                      <View style={styles.marketStatItem}>
                        <Text style={styles.marketStatLabel}>Expected Return</Text>
                        <Text style={[styles.marketStatValue, { color: Colors.wealth.profit }]}>
                          {(item.expectedReturn * 100).toFixed(1)}%
                        </Text>
                      </View>
                    </View>

                    {owned && (
                      <View style={styles.ownedBanner}>
                        <Text style={styles.ownedText}>You own {owned.sharesOwned} shares</Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => openBuyModal(item)}
                    >
                      <ShoppingCart size={16} color={Colors.gold.primary} />
                      <Text style={styles.buyButtonText}>Buy</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Pressable
            style={styles.navButton}
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.push('/');
            }}
          >
            <View style={styles.navIcon}>
              <View style={styles.homeIconOutline} />
            </View>
            <Text style={styles.navLabel}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.navButton}
            onPress={async () => {
              await triggerHaptic('impactLight');
              // Already on investments
            }}
          >
            <View style={styles.navIcon}>
              <Text style={styles.navIconText}>📈</Text>
            </View>
            <Text style={[styles.navLabel, { color: Colors.gold.primary }]}>Investments</Text>
          </Pressable>

          <Pressable
            style={styles.navButton}
            onPress={async () => {
              await triggerHaptic('impactLight');
              router.push('/chats');
            }}
          >
            <View style={styles.navIcon}>
              <Text style={styles.navIconText}>💬</Text>
            </View>
            <Text style={styles.navLabel}>Chats</Text>
          </Pressable>
        </View>
      </View>

      {/* Buy Modal */}
      <Modal
        visible={buyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeBuyModal}
      >
        <BlurView intensity={20} style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modal}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Text style={styles.modalTitle}>Buy {selectedAsset?.symbol}</Text>
                  <TouchableOpacity onPress={closeBuyModal} style={styles.closeButton}>
                    <X size={20} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>{selectedAsset?.name}</Text>
              </View>

              {/* Asset Info */}
              <View style={styles.assetInfo}>
                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Current Price</Text>
                  <Text style={styles.assetInfoValue}>${selectedAsset?.sharePrice.toFixed(2)}</Text>
                </View>
                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Risk Level</Text>
                  <View style={[styles.riskBadge, { backgroundColor: getRiskBadgeColor(selectedAsset?.riskLevel || 'medium') }]}>
                    <Text style={styles.riskBadgeText}>{selectedAsset?.riskLevel.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Expected Return</Text>
                  <Text style={[styles.assetInfoValue, { color: Colors.wealth.profit }]}>
                    {((selectedAsset?.expectedReturn || 0) * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>

              {/* Share Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Number of Shares</Text>
                <View style={styles.inputRow}>
                  <TouchableOpacity
                    style={styles.inputButton}
                    onPress={async () => {
                      await triggerHaptic('impactLight');
                      const current = parseInt(shareCount) || 1;
                      if (current > 1) setShareCount((current - 1).toString());
                    }}
                  >
                    <Text style={styles.inputButtonText}>-</Text>
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.input}
                    value={shareCount}
                    onChangeText={setShareCount}
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.text.tertiary}
                    maxLength={6}
                  />
                  
                  <TouchableOpacity
                    style={styles.inputButton}
                    onPress={async () => {
                      await triggerHaptic('impactLight');
                      const current = parseInt(shareCount) || 0;
                      setShareCount((current + 1).toString());
                    }}
                  >
                    <Text style={styles.inputButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Cost Calculation */}
              <View style={styles.costSection}>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Total Cost</Text>
                  <Text style={styles.costValue}>
                    ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Available Funds</Text>
                  <Text style={[styles.costValue, { color: canAfford ? Colors.wealth.profit : Colors.wealth.loss }]}>
                    ${availableFunds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
                {!canAfford && (
                  <View style={styles.warningBanner}>
                    <AlertCircle size={16} color={Colors.wealth.loss} />
                    <Text style={styles.warningText}>
                      Insufficient funds. Need ${(totalCost - availableFunds).toFixed(2)} more
                    </Text>
                  </View>
                )}
              </View>

              {/* Emotional Impact Preview */}
              {selectedAsset && (
                <View style={styles.impactSection}>
                  <Text style={styles.impactTitle}>Impact</Text>
                  <View style={styles.impactGrid}>
                    {selectedAsset.riskLevel === 'high' && (
                      <>
                        <View style={styles.impactItem}>
                          <Frown size={16} color={Colors.wealth.loss} />
                          <Text style={styles.impactText}>Stress +10</Text>
                        </View>
                        <View style={styles.impactItem}>
                          <TrendingUp size={16} color={Colors.wealth.profit} />
                          <Text style={styles.impactText}>Prospects +5</Text>
                        </View>
                      </>
                    )}
                    {selectedAsset.riskLevel === 'low' && (
                      <>
                        <View style={styles.impactItem}>
                          <Smile size={16} color={Colors.wealth.profit} />
                          <Text style={styles.impactText}>Stress -3</Text>
                        </View>
                        <View style={styles.impactItem}>
                          <Smile size={16} color={Colors.wealth.profit} />
                          <Text style={styles.impactText}>Happiness +2</Text>
                        </View>
                      </>
                    )}
                    {selectedAsset.riskLevel === 'medium' && (
                      <View style={styles.impactItem}>
                        <Text style={[styles.impactText, { color: Colors.text.secondary }]}>Neutral impact</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeBuyModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.confirmButton, !canAfford && styles.confirmButtonDisabled]}
                  onPress={handleBuyConfirm}
                  disabled={!canAfford || shareCountNum <= 0}
                >
                  <CheckCircle2 size={16} color={canAfford ? Colors.gold.primary : Colors.text.disabled} />
                  <Text style={[styles.confirmButtonText, !canAfford && styles.confirmButtonTextDisabled]}>
                    Confirm Purchase
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </Modal>

      {/* Sell Modal */}
      <Modal
        visible={sellModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeSellModal}
      >
        <BlurView intensity={20} style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modal}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  <Text style={styles.modalTitle}>Sell {selectedInvestment?.symbol}</Text>
                  <TouchableOpacity onPress={closeSellModal} style={styles.closeButton}>
                    <X size={20} color={Colors.text.secondary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalSubtitle}>{selectedInvestment?.name}</Text>
              </View>

              {/* Investment Info */}
              <View style={styles.assetInfo}>
                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Shares Owned</Text>
                  <Text style={styles.assetInfoValue}>{selectedInvestment?.sharesOwned.toLocaleString()}</Text>
                </View>
                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Current Price</Text>
                  <Text style={styles.assetInfoValue}>${selectedInvestment?.sharePrice.toFixed(2)}</Text>
                </View>
                <View style={styles.assetInfoRow}>
                  <Text style={styles.assetInfoLabel}>Purchase Price</Text>
                  <Text style={styles.assetInfoValue}>${selectedInvestment?.purchasePrice.toFixed(2)}</Text>
                </View>
              </View>

              {/* Share Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Number of Shares to Sell</Text>
                <View style={styles.inputRow}>
                  <TouchableOpacity
                    style={styles.inputButton}
                    onPress={async () => {
                      await triggerHaptic('impactLight');
                      const current = parseInt(shareCount) || 1;
                      if (current > 1) setShareCount((current - 1).toString());
                    }}
                  >
                    <Text style={styles.inputButtonText}>-</Text>
                  </TouchableOpacity>
                  
                  <TextInput
                    style={styles.input}
                    value={shareCount}
                    onChangeText={setShareCount}
                    keyboardType="number-pad"
                    placeholderTextColor={Colors.text.tertiary}
                    maxLength={6}
                  />
                  
                  <TouchableOpacity
                    style={styles.inputButton}
                    onPress={async () => {
                      await triggerHaptic('impactLight');
                      const current = parseInt(shareCount) || 0;
                      const max = selectedInvestment?.sharesOwned || 0;
                      if (current < max) setShareCount((current + 1).toString());
                    }}
                  >
                    <Text style={styles.inputButtonText}>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.maxButton}
                    onPress={async () => {
                      await triggerHaptic('impactLight');
                      setShareCount(selectedInvestment?.sharesOwned.toString() || '0');
                    }}
                  >
                    <Text style={styles.maxButtonText}>MAX</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* P&L Calculation */}
              <View style={styles.plSection}>
                <View style={styles.plHeader}>
                  <Text style={styles.plHeaderText}>Sale Summary</Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Sale Proceeds</Text>
                  <Text style={styles.costValue}>
                    ${proceeds.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Profit/Loss</Text>
                  <Text style={[styles.plValue, { color: gainLoss >= 0 ? Colors.wealth.profit : Colors.wealth.loss }]}>
                    {gainLoss >= 0 ? '+' : ''}${gainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Return</Text>
                  <Text style={[styles.plValue, { color: gainLoss >= 0 ? Colors.wealth.profit : Colors.wealth.loss }]}>
                    {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                  </Text>
                </View>
              </View>

              {/* Emotional Impact Preview */}
              <View style={styles.impactSection}>
                <Text style={styles.impactTitle}>Impact</Text>
                <View style={styles.impactGrid}>
                  {gainLoss > 0 ? (
                    <>
                      <View style={styles.impactItem}>
                        <Smile size={16} color={Colors.wealth.profit} />
                        <Text style={styles.impactText}>Happiness +5</Text>
                      </View>
                      <View style={styles.impactItem}>
                        <Smile size={16} color={Colors.wealth.profit} />
                        <Text style={styles.impactText}>Stress -3</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.impactItem}>
                        <Frown size={16} color={Colors.wealth.loss} />
                        <Text style={styles.impactText}>Happiness -5</Text>
                      </View>
                      <View style={styles.impactItem}>
                        <Frown size={16} color={Colors.wealth.loss} />
                        <Text style={styles.impactText}>Stress +5</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeSellModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.sellConfirmButton]}
                  onPress={handleSellConfirm}
                  disabled={shareCountNum <= 0 || shareCountNum > (selectedInvestment?.sharesOwned || 0)}
                >
                  <CheckCircle2 size={16} color={Colors.wealth.loss} />
                  <Text style={styles.sellConfirmButtonText}>
                    Confirm Sale
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </Modal>
    </View>
  );
}

// Helper functions
const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'stock': return Colors.status.info + '30';
    case 'etf': return Colors.wealth.profit + '30';
    case 'bond': return Colors.gold.glow;
    case 'crypto': return Colors.wealth.loss + '30';
    default: return Colors.surface.card.elevated;
  }
};

const getRiskBadgeColor = (risk: string) => {
  switch (risk) {
    case 'low': return Colors.wealth.profit + '30';
    case 'medium': return Colors.gold.glow;
    case 'high': return Colors.wealth.loss + '30';
    default: return Colors.surface.card.elevated;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.default,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },

  // Hero Card
  heroCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.gold,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  heroLabel: {
    ...Typography.label.medium,
    color: Colors.text.secondary,
    letterSpacing: 1,
  },
  trendBadge: {
    backgroundColor: Colors.gold.glow,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
  },
  trendPositive: {
    backgroundColor: Colors.wealth.profit + '30',
  },
  trendNegative: {
    backgroundColor: Colors.wealth.loss + '30',
  },
  heroAmount: {
    ...Typography.display.large,
    color: Colors.gold.primary,
    marginBottom: Spacing.xs,
  },
  heroPL: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  heroPLText: {
    ...Typography.heading.h3,
  },
  heroPLPercent: {
    ...Typography.body.medium,
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.gold.glow,
  },
  tabText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.gold.primary,
  },
  tabBadge: {
    backgroundColor: Colors.gold.primary,
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs / 2,
  },
  tabBadgeText: {
    ...Typography.label.small,
    color: Colors.surface.background,
    fontSize: 10,
    fontWeight: '700',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    ...Typography.heading.h2,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  emptyButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.gold.glow,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gold.primary,
  },
  emptyButtonText: {
    ...Typography.body.medium,
    color: Colors.gold.primary,
    fontWeight: '600',
  },

  // Portfolio
  portfolioContainer: {
    gap: Spacing.md,
  },
  investmentCard: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  investmentHeader: {
    marginBottom: Spacing.md,
  },
  investmentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  investmentSymbol: {
    ...Typography.heading.h3,
    color: Colors.gold.primary,
    fontWeight: '700',
  },
  investmentName: {
    ...Typography.body.small,
    color: Colors.text.secondary,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.md,
  },
  typeBadgeText: {
    ...Typography.label.small,
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  investmentStats: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
  },
  statValue: {
    ...Typography.body.medium,
    color: Colors.text.primary,
  },
  statValueBold: {
    fontWeight: '600',
  },
  plContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.divider,
  },
  plRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  plLabel: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  plValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.xs,
  },
  plAmount: {
    ...Typography.heading.h4,
    fontWeight: '700',
  },
  plPercent: {
    ...Typography.body.small,
    fontWeight: '600',
  },
  sellButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.wealth.loss + '20',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.wealth.loss,
    alignItems: 'center',
  },
  sellButtonText: {
    ...Typography.body.medium,
    color: Colors.wealth.loss,
    fontWeight: '600',
  },

  // Market
  marketContainer: {
    gap: Spacing.md,
  },
  marketCard: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  marketHeader: {
    marginBottom: Spacing.md,
  },
  marketTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  marketSymbol: {
    ...Typography.heading.h3,
    color: Colors.gold.primary,
    fontWeight: '700',
  },
  marketName: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  marketDescription: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  riskBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.md,
  },
  riskBadgeText: {
    ...Typography.label.small,
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  marketStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  marketStatItem: {
    flex: 1,
    minWidth: '30%',
  },
  marketStatLabel: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
  },
  marketStatValue: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  ownedBanner: {
    backgroundColor: Colors.gold.glow,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  ownedText: {
    ...Typography.body.small,
    color: Colors.gold.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.gold.glow,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gold.primary,
  },
  buyButtonText: {
    ...Typography.body.medium,
    color: Colors.gold.primary,
    fontWeight: '600',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: 12,
    backgroundColor: Colors.surface.card.elevated,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  navIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  homeIconOutline: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: Colors.text.secondary,
    borderRadius: 4,
  },
  navIconText: {
    fontSize: 18,
  },
  navLabel: {
    ...Typography.label.small,
    color: Colors.text.secondary,
    fontSize: 9,
  },

  // Buy Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface.card.elevated,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    marginBottom: Spacing.md,
  },
  modalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    ...Typography.heading.h3,
    color: Colors.gold.primary,
  },
  modalSubtitle: {
    ...Typography.body.small,
    color: Colors.text.secondary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  assetInfo: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  assetInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetInfoLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    fontSize: 13,
  },
  assetInfoValue: {
    ...Typography.body.small,
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  inputSection: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.body.small,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inputButton: {
    width: 38,
    height: 38,
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  inputButtonText: {
    ...Typography.heading.h4,
    color: Colors.gold.primary,
    fontSize: 20,
  },
  input: {
    flex: 1,
    height: 38,
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingHorizontal: Spacing.sm,
    ...Typography.body.medium,
    color: Colors.text.primary,
    textAlign: 'center',
    fontSize: 14,
  },
  costSection: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    fontSize: 13,
  },
  costValue: {
    ...Typography.body.medium,
    color: Colors.text.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.wealth.loss + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
  },
  warningText: {
    ...Typography.body.small,
    color: Colors.wealth.loss,
    flex: 1,
    fontSize: 12,
  },
  impactSection: {
    marginBottom: Spacing.md,
  },
  impactTitle: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    fontSize: 13,
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface.card.default,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  impactText: {
    ...Typography.label.medium,
    color: Colors.text.primary,
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.body.small,
    color: Colors.text.secondary,
    fontWeight: '600',
    fontSize: 13,
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gold.glow,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gold.primary,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
    borderColor: Colors.border.default,
  },
  confirmButtonText: {
    ...Typography.body.small,
    color: Colors.gold.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  confirmButtonTextDisabled: {
    color: Colors.text.disabled,
  },
  maxButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.gold.glow,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gold.primary,
  },
  maxButtonText: {
    ...Typography.label.small,
    color: Colors.gold.primary,
    fontWeight: '700',
    fontSize: 11,
  },
  plSection: {
    backgroundColor: Colors.surface.card.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  plHeader: {
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.divider,
  },
  plHeaderText: {
    ...Typography.body.small,
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  plValue: {
    ...Typography.body.medium,
    fontWeight: '700',
    fontSize: 15,
  },
  sellConfirmButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.wealth.loss + '20',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.wealth.loss,
  },
  sellConfirmButtonText: {
    ...Typography.body.small,
    color: Colors.wealth.loss,
    fontWeight: '700',
    fontSize: 13,
  },
});
